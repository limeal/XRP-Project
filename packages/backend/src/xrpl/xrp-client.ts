// Methods to interact with the XRPL

import {
  Amount,
  Client,
  convertStringToHex,
  NFTokenAcceptOffer,
  NFTokenCreateOffer,
  NFTokenCreateOfferFlags,
  NFTokenMint,
  NFTokenMintFlags,
  Payment,
  SubmittableTransaction,
  TxResponse,
  Wallet,
} from 'xrpl';
import { XRPToken } from './xrp-token';
import { Xumm } from 'xumm';
import { publishSSEEvent } from '../app';

interface IXRPClient {
  getServerType(): Promise<string>;
  getClient(mode: 'force-reconnect' | 'no-reconnect'): Promise<Client>;

  // Equivalent to mint
  createNFTToken(
    imageUrl: string
  ): Promise<string>;

  createOfferForToken(
    type: 'sell' | 'buy',
    price: Amount,
    tokenId: string
  ): Promise<string>;

  acceptOfferForToken(
    type: 'sell' | 'buy',
    offerId: string
  ): Promise<string>;

  getAccountBalance(accountAddress: string): Promise<number>;
}

const xumm = new Xumm(process.env.XUMM_API_KEY!, process.env.XUMM_API_SECRET);

export class XRPClient implements IXRPClient {
  private client: Client;

  constructor(
    private readonly accountAddress: string,
    private readonly serverType: 'devnet' | 'altnet' = 'altnet',
  ) {
    this.client = new Client(`wss://s.${this.serverType}.rippletest.net:51233`);
  }

  async connect() {
    return this.client.connect();
  }

  async disconnect() {
    return this.client.disconnect();
  }

  async getClient(
    mode: 'force-reconnect' | 'no-reconnect' = 'force-reconnect'
  ): Promise<Client> {
    if (mode === 'force-reconnect' && !this.client.isConnected()) {
      await this.client.connect();
    }

    return this.client;
  }

  /**
   * Gets the server type of the XRPL client
   *
   * @returns {Promise<string>} The server type
   */
  async getServerType() {
    return this.serverType;
  }

  /**
   * Subscribes to a payload and extracts the QR code
   *
   * @param {any} payload - The payload to subscribe to
   * @returns {Promise<string>} The QR code
   */
  private async subscribeAndExtractMeta(payload: any) {
    const result = await xumm.payload?.createAndSubscribe(payload, (event) => {
      if (Object.keys(event.data).indexOf('signed') > -1) {
        return event;
      }
    });

    if (!result) {
      throw new Error('Failed to create and subscribe to the payload');
    }

    publishSSEEvent(result?.created?.refs?.qr_png);

    const resolved = await result.resolved;
    const txId = (resolved as any).data.txid;

    console.log('Transaction ID:', txId);

    const tx = await this.getTransaction(txId);

    console.log('Transaction:', tx);
    return tx.result.meta;
  }

  /**
   * Creates an NFToken on the XRPL
   *
   * @param {string} issuerSeed - The seed of the account issuing the token
   * @param {XRPToken} token - The token to create
   * @param {Pick<NFTokenMint, 'Flags' | 'TransferFee'>} transactionOptions - Optional transaction options
   * @returns {Promise<TxResponse<NFTokenMint>>} The transaction result
   */
  async createNFTToken(imageUrl: string) {
    const meta = await this.subscribeAndExtractMeta(
      {
        TransactionType: 'NFTokenMint',
        Account: this.accountAddress,
        URI: convertStringToHex(imageUrl),
        NFTokenTaxon: 0, // Required field, can be any value from 0 to 2^32-1
        Flags: NFTokenMintFlags.tfBurnable | NFTokenMintFlags.tfTransferable,
      }
    );

    const nftokenId = (meta as any).nftoken_id;
    console.log('NFToken ID:', nftokenId);
    return nftokenId;
  }

  /**
   * Creates an NFToken offer on the XRPL
   *
   * @param {string} ownerSeed - The seed of the account creating the offer
   * @param {string} tokenId - The ID of the token to offer
   * @param {Amount} price - The price of the token
   * @returns {Promise<TxResponse<NFTokenCreateOffer>>} The transaction result
   */
  async createOfferForToken(
    type: 'sell' | 'buy',
    price: Amount,
    tokenId: string
  ) {
    const meta = await this.subscribeAndExtractMeta(
      {
        TransactionType: 'NFTokenCreateOffer',
        Account: this.accountAddress,
        Amount: price,
        NFTokenID: tokenId,
        Flags: type === 'sell' ? NFTokenCreateOfferFlags.tfSellNFToken : 0,
      }
    );

    return (meta as any).offer_id;
  }

  /**
   * Accepts an NFToken offer on the XRPL
   *
   * @param {string} buyerSeed - The seed of the account accepting the offer
   * @param {string} offerId - The ID of the offer to accept
   * @returns {Promise<TxResponse<NFTokenAcceptOffer>>} The transaction result
   */
  async acceptOfferForToken(
    type: 'sell' | 'buy',
    offerId: string
  ) {
    const meta = await this.subscribeAndExtractMeta(
      {
        TransactionType: 'NFTokenAcceptOffer',
        Account: this.accountAddress,
        NFTokenSellOffer: type === 'sell' ? offerId : undefined,
        NFTokenBuyOffer: type === 'buy' ? offerId : undefined,
      }
    );

    return 'OK';
  }

  /**
   * Gets a transaction from the XRPL
   *
   * @param {string} transactionId - The ID of the transaction to get
   * @returns {Promise<TxResponse<any>>} The transaction result
   */
  async getTransaction(transactionId: string) {
    await this.client.connect();

    const response = await this.client.request({
      command: 'tx',
      transaction: transactionId,
    });

    await this.client.disconnect();
    return response;
  }

  /**
   * Get the balance of an account
   *
   * @param {string} accountAddress - The account address to check
   * @returns {Promise<number>} The balance of the account
   */
  async getAccountBalance(accountAddress: string): Promise<number> {
    const response = await this.client.request({
      command: 'account_info',
      account: accountAddress,
    });

    return Number(response.result.account_data.Balance);
  }
}
