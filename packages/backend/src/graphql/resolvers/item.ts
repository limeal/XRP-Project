import { EntityType, Item } from '@prisma/client';
import prisma from '../../prisma/client';
import { XRPClient } from '../../xrpl/xrp-client';
import { Context } from '../../app';
import { XRPToken } from '../../xrpl/xrp-token';
import { storage } from '../../services/storage';
import { Wallet } from 'xrpl';

const itemResolvers = {
  Query: {
    items: async () => {
      return await prisma.item.findMany();
    },
    item: async (_: any, { id }: { id: string }) => {
      return await prisma.item.findUnique({
        where: { id },
      });
    },
  },
  Item: {
    owner: async (parent: any) => {
      return await prisma.user.findUnique({
        where: { id: parent.owner_id },
      });
    },
    comments: async (parent: any) => {
      return await prisma.comment.findMany({
        where: {
          entity_type: EntityType.ITEM,
          entity_id: parent.id
        },
      });
    },
    tags: async (parent: any) => {
      return await prisma.tag.findMany({
        where: {
          entity_type: EntityType.ITEM,
          entity_id: parent.id
        },
      });
    },
    prices: async (parent: any) => {
      return await prisma.itemPrice.findMany({
        where: { item_id: parent.id },
      });
    },
  },
  Mutation: {
    createItem: async (_: any, data: { 
      name: string, 
      description: string, 
      image: string,
    }, context: Context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        // Validate and save image
        if (!data.image.startsWith('data:image/')) {
          throw new Error('Invalid image format. Must start with data:image/');
        }

        const base64Data = data.image.split(';base64,').pop();
        if (!base64Data) {
          throw new Error('Invalid base64 image data');
        }

        const imageBuffer = Buffer.from(base64Data, 'base64');
        if (imageBuffer.length > 5 * 1024 * 1024) {
          throw new Error('Image too large. Maximum size is 5MB');
        }

        const timestamp = Date.now();
        const filename = `nft-${timestamp}.png`;
        const imageUrl = await storage.saveFile(imageBuffer, filename);

        // XRP Ledger operations
        const xrpClient = new XRPClient('altnet'); // Spécifier le réseau testnet
        await xrpClient.connect();

        const user = await prisma.user.findUnique({
          where: { id: context.user.id },
          select: { xrp_seed: true }
        });

        if (!user?.xrp_seed) {
          throw new Error('User does not have an XRP seed');
        }

        // Get wallet from seed
        const wallet = Wallet.fromSeed(user.xrp_seed);
        
        // Check account balance and fund if needed
        const balance = await xrpClient.getAccountBalance(wallet.address);
        if (balance < 10) {
          await xrpClient.fundWallet(wallet);
          console.log('Wallet funded successfully');
        }

        // Create NFT
        const nftToken = new XRPToken({
          name: data.name,
          description: data.description,
          image: imageUrl
        });
        
        const result = await xrpClient.createNFTToken(user.xrp_seed, nftToken);
        await xrpClient.disconnect();

        // Create item in database
        return await prisma.item.create({
          data: {
            name: data.name,
            description: data.description,
            image_url: imageUrl,
            xrp_id: result.result.hash,
            owner_id: context.user.id
          },
        });
      } catch (error) {
        console.error('Error creating item:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to create item: ${error.message}`);
        }
        throw new Error('Failed to create item');
      }
    },
    updateItem: async (_: any, data: Partial<Omit<Item, 'id' | 'owner_id'>> & { id: string }) => {
      return await prisma.item.update({
        where: { id: data.id },
        data,
      });
    },
    deleteItem: async (_: any, { id }: { id: string }) => {
      return await prisma.item.delete({
        where: { id },
      });
    },
  },
};

export default itemResolvers;