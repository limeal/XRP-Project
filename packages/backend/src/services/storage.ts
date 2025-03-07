import pinataSDK from '@pinata/sdk';
import { FileUpload } from 'graphql-upload-ts';

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_KEY!
);

export const storage = {
  async saveFile(file: FileUpload, itemName: string): Promise<string> {
    try {
      const { createReadStream } = await file;
      const stream = createReadStream();
      
      const options = {
        pinataMetadata: {
          name: `${itemName.toLowerCase().replace(/\s+/g, '-')}`
        }
      };
      
      const result = await pinata.pinFileToIPFS(stream, options);
      const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      
      console.log('File saved:', url);
      return url;
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  },

  async unpinFile(cid: string): Promise<void> {
    try {
      await pinata.unpin(cid);
      console.log(`Successfully unpinned file with CID: ${cid}`);
    } catch (error) {
      console.error(`Error unpinning file with CID ${cid}:`, error);
      throw error;
    }
  }
};
