import { Xumm } from 'xumm';
import { Client, NFTokenMintFlags } from 'xrpl';
import { convertStringToHex } from 'xrpl';
import qrcode from 'qrcode-terminal';
const client = new Client('wss://s.altnet.rippletest.net:51233'); // Testnet

const xumm = new Xumm('7d745b73-954e-4431-9b59-623750e1f95f', '361df257-0e70-4aea-9933-ebccc2f80b50');

async function mintAndToken(uri: string) {


    // Convert the uri to a hex string
    const hexUri = convertStringToHex(uri);

    try {
        // Put a title on the token
        const result = await xumm.payload?.createAndSubscribe({
            TransactionType: 'NFTokenMint' as const,
            URI: hexUri,
            NFTokenTaxon: 0,
            Flags: NFTokenMintFlags.tfBurnable | NFTokenMintFlags.tfTransferable,
        }, eventMessage => {
            if (Object.keys(eventMessage.data).indexOf('opened') > -1) {
                // Update the UI? The payload was opened.
            }
            if (Object.keys(eventMessage.data).indexOf('signed') > -1) {
                // The `signed` property is present, true (signed) / false (rejected)
                return eventMessage
            }
        });

        if (result) {
            console.log('Payload URL:', result.created.next.always);
            console.log('Payload QR:', result.created.refs.qr_png);

            qrcode.generate(result.created.next.always, { small: true });
            
            const resolved = await result.resolved;

            // Extract the transaction id from the payload
            const txId = (resolved as any).data.txid;
            return txId;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function createOfferNft(nftokenID: string) {
    await client.connect();
    try {
        const result = await xumm.payload?.createAndSubscribe({
            TransactionType: 'NFTokenCreateOffer' as const,
            NFTokenID: nftokenID,
            Amount: '1000000',
            Flags: 1,
        }, eventMessage => {
            if (Object.keys(eventMessage.data).indexOf('signed') > -1) {
                return eventMessage;
            }
        });

        if (result) {
            console.log('Payload URL:', result.created.next.always);
            console.log('Payload QR:', result.created.refs.qr_png);

            // open the payload in the browser
            qrcode.generate(result.created.next.always, { small: true });
            
            const payload = await result.resolved;

            const payloadData = (payload as any).data;

            if (payloadData.signed === true) {
                const txId = payloadData.txid;
                return txId;
            } else {
                throw new Error('Transaction was rejected by the user');
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function acceptOfferNft(offerId: string) {
    try {
        const result = await xumm.payload?.createAndSubscribe({
            TransactionType: 'NFTokenAcceptOffer' as const,
            NFTokenSellOffer: offerId,
        }, eventMessage => {
            if (Object.keys(eventMessage.data).indexOf('signed') > -1) {
                return eventMessage;
            }
        });

        if (result) {
            console.log('Payload URL:', result.created.next.always);
            console.log('Payload QR:', result.created.refs.qr_png);

            // open the payload in the browser
            qrcode.generate(result.created.next.always, { small: true });

            const payload = await result.resolved;
            console.log('Payload resolved', payload);

            const payloadData = (payload as any).data;

            if (payloadData.signed === true) {
                const txId = payloadData.txid;
                return txId;
            } else {
                throw new Error('Transaction was rejected by the user');
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function getDataFromTransaction(transactionId: string) {
    await client.connect();
    const tx = await client.request({
        command: 'tx',
        transaction: transactionId,
    });
    console.log(tx);
    await client.disconnect();

    return { meta: tx.result.meta, tx_json: tx.result.tx_json };
}

async function main() {
    //const limeal = 'rfHn6cB5mmqZ6fHZ4fdemCDSxqLTijgMwo';
    //const lewis = 'r3rPFsbKTs1NWbTNyyWEUBkie1DfvVn1GU';
    const ipfsHash = 'QmPkfGG3wQZ38dCj9NvYHcLBgWiB7fZxye2C6nY2qWdbVY';

    console.log('Minting token...');
    const result = await mintAndToken(`ipfs://${ipfsHash}`);

    console.log('Minted token tx_id: ', result);

    console.log('Getting nftoken id...');
    await client.connect();
    const tx = await getDataFromTransaction(result);
    await client.disconnect();

    // Access the NFToken ID from the affected_nodes in metadata
    const nftokenID = (tx.meta as any).nftoken_id;
    console.log('Nftoken id: ', nftokenID);

    console.log('Creating offer...');
    const txId = await createOfferNft(nftokenID);

    console.log('Accepting offer tx_id: ', txId);

    const tx2 = await getDataFromTransaction(txId);

    const offerId = (tx2.meta as any)?.offer_id;
    console.log('offerId', offerId);

    console.log('Accepting offer...');
    await acceptOfferNft(offerId);
}

main();