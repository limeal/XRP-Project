// Methods to interact with the XRPL

import {
  Amount,
  Client,
  NFTokenAcceptOffer,
  NFTokenCreateOffer,
  NFTokenCreateOfferFlags,
  NFTokenMint,
  Payment,
  SubmittableTransaction,
  TxResponse,
  Wallet,
} from 'xrpl';
import { XRPToken } from './xrp-token';

interface IXRPClient {
  getServerType(): Promise<string>;
  getClient(mode: 'force-reconnect' | 'no-reconnect'): Promise<Client>;

  // Equivalent to mint
  createNFTToken(
    issuerSeed: string,
    token: XRPToken,
    transactionOptions?: Pick<NFTokenMint, 'Flags' | 'TransferFee'>
  ): Promise<TxResponse<NFTokenMint>>;

  createOfferForToken(
    type: 'sell' | 'buy',
    price: Amount,
    ownerSeed: string,
    tokenId: string
  ): Promise<TxResponse<NFTokenCreateOffer>>;

  acceptOfferForToken(
    type: 'sell' | 'buy',
    buyerSeed: string,
    offerId: string
  ): Promise<TxResponse<NFTokenAcceptOffer>>;

  getAccountTokens(accountAddress: string): Promise<Array<XRPToken>>;
  getAccountBalance(accountAddress: string): Promise<number>;
}

export class XRPClient implements IXRPClient {
  private client: Client;

  constructor(private readonly serverType: 'devnet' | 'altnet' = 'altnet') {
    this.client = new Client(`wss://s.${serverType}.rippletest.net:51233`);
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
   * Submits a transaction to the XRPL
   *
   * @param {SubmittableTransaction} transaction - The transaction to submit
   * @param {Wallet} wallet - The wallet to sign the transaction
   * @returns {Promise<TxResponse<T>>} The transaction result
   */
  private async submitTransaction<T extends SubmittableTransaction>(
    transaction: T,
    wallet: Wallet
  ) {
    const client = await this.getClient();

    return client.submitAndWait(transaction, {
      wallet,
    });
  }

  /**
   * Creates an NFToken on the XRPL
   *
   * @param {string} issuerSeed - The seed of the account issuing the token
   * @param {XRPToken} token - The token to create
   * @param {Pick<NFTokenMint, 'Flags' | 'TransferFee'>} transactionOptions - Optional transaction options
   * @returns {Promise<TxResponse<NFTokenMint>>} The transaction result
   */
  async createNFTToken(
    issuerSeed: string,
    token: XRPToken,
    transactionOptions?: Pick<NFTokenMint, 'Flags' | 'TransferFee'>
  ) {
    const issuerWallet = Wallet.fromSeed(issuerSeed);

    return this.submitTransaction<NFTokenMint>(
      {
        TransactionType: 'NFTokenMint',
        Account: issuerWallet.address,
        URI: token.encode(),
        NFTokenTaxon: 0, // Required field, can be any value from 0 to 2^32-1
        LastLedgerSequence: (await this.client.getLedgerIndex()) + 20,
        ...transactionOptions,
      },
      issuerWallet
    );
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
    ownerSeed: string,
    tokenId: string
  ) {
    const ownerWallet = Wallet.fromSeed(ownerSeed);

    return this.submitTransaction<NFTokenCreateOffer>(
      {
        TransactionType: 'NFTokenCreateOffer',
        Account: ownerWallet.address,
        Amount: price,
        NFTokenID: tokenId,
        Flags: type === 'sell' ? NFTokenCreateOfferFlags.tfSellNFToken : 0,
      },
      ownerWallet
    );
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
    buyerSeed: string,
    offerId: string
  ) {
    const buyerWallet = Wallet.fromSeed(buyerSeed);

    return this.submitTransaction<NFTokenAcceptOffer>(
      {
        TransactionType: 'NFTokenAcceptOffer',
        Account: buyerWallet.address,
        NFTokenSellOffer: type === 'sell' ? offerId : undefined,
        NFTokenBuyOffer: type === 'buy' ? offerId : undefined,
      },
      buyerWallet
    );
  }

  /**
   * Get all NFTokens owned by an account
   *
   * @param {string} accountAddress - The account address to check
   * @returns {Promise<Array>} List of NFTokens owned by the account
   */
  async getAccountTokens(accountAddress: string): Promise<Array<XRPToken>> {
    try {
      const response = await this.client.request({
        command: 'account_nfts',
        account: accountAddress,
      });

      return response.result.account_nfts
        .filter((token) => token.URI)
        .map((token) => {
          return new XRPToken(token);
        });
    } catch (error) {
      console.error('Error getting account NFTs:', error);
      throw error;
    }
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

  /**
   * Create a new account on the XRPL testnet with some initial XRP
   * Useful for testing purposes
   *
   * @returns {Promise<object>} The wallet information
   */
  async createTestnetAccount() {
    if (this.serverType !== 'altnet') {
      throw new Error('This function is only available on the altnet');
    }

    try {
      // Fund a new account on the testnet
      const fund_result = await this.client.fundWallet();
      const test_wallet = fund_result.wallet;

      return {
        address: test_wallet.address,
        seed: test_wallet.seed,
        balance: fund_result.balance,
      };
    } catch (error) {
      console.error('Error creating testnet account:', error);
      throw error;
    }
  }

  public async fundWallet(wallet: Wallet): Promise<void> {
    try {
      const client = await this.getClient('no-reconnect');
      const fund_result = await client.fundWallet();

      const tx: Payment = {
        TransactionType: 'Payment',
        Account: fund_result.wallet.address,
        Destination: wallet.address,
        Amount: '1000000000',
      };

      await client.submitAndWait(tx, { wallet: fund_result.wallet });
    } catch (error) {
      console.error('Error funding wallet:', error);
      throw error;
    }
  }
}
