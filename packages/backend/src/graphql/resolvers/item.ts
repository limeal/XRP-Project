import { EntityType, Item } from '@prisma/client';
import { Context } from '../../app';
import prisma from '../../prisma/client';
import { storage } from '../../services/storage';

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
    userItems: async (_: any, { userId }: { userId: string }) => {
      return await prisma.item.findMany({
        where: { owner_id: userId },
        include: {
          prices: {
            orderBy: { created_at: 'desc' },
            take: 1,
          },
        },
      });
    },
    itemsForSale: async () => {
      return await prisma.item.findMany({
        where: {
          prices: {
            some: {
              offer_xrp_id: { not: null }, // Items with active offers are for sale
            },
          },
        },
        include: {
          prices: {
            orderBy: { created_at: 'desc' },
            take: 1,
          },
        },
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
          entity_id: parent.id,
        },
      });
    },
    tags: async (parent: any) => {
      return await prisma.tag.findMany({
        where: {
          entity_type: EntityType.ITEM,
          entity_id: parent.id,
        },
      });
    },
    prices: async (parent: any) => {
      return await prisma.itemPrice.findMany({
        where: { item_id: parent.id },
      });
    },
    isForSale: async (parent: any) => {
      const latestPrice = await prisma.itemPrice.findFirst({
        where: { item_id: parent.id },
        orderBy: { created_at: 'desc' },
      });
      return !!latestPrice?.offer_xrp_id;
    },
  },
  Mutation: {
    createItem: async (
      _: any,
      data: {
        name: string;
        description: string;
        image: any;
      },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      try {
        // Validate image format
        if (!data.image.startsWith('data:image/')) {
          throw new Error(
            'Invalid image format. Must be a data URL starting with data:image/'
          );
        }

        const timestamp = Date.now();
        const filename = `nft-${timestamp}.png`;
        const imageUrl = await storage.saveFile(data.image, filename);

        // Create item in database
        return await prisma.item.create({
          data: {
            name: data.name,
            description: data.description,
            image_url: imageUrl,
            owner_id: context.user.id,
            published: false,
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
    updateItem: async (
      _: any,
      data: Partial<Omit<Item, 'id' | 'owner_id'>> & { id: string }
    ) => {
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
    putItemForSale: async (
      _: any,
      { itemId, price }: { itemId: string; price: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const item = await prisma.item.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        throw new Error('Item not found');
      }

      if (item.owner_id !== context.user.id) {
        throw new Error('You do not own this item and cannot put it for sale');
      }

      return await prisma.itemPrice.create({
        data: {
          item_id: itemId,
          price: BigInt(price),
        },
      });
    },
    buyItem: async (
      _: any,
      { itemId }: { itemId: string },
      context: Context
    ) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: {
          prices: true,
        },
      });

      if (!item || !item.prices.length) {
        throw new Error('Item not found or not for sale');
      }

      if (item.owner_id === context.user.id) {
        throw new Error('Cannot buy your own item');
      }

      await prisma.itemPrice.deleteMany({
        where: { item_id: itemId },
      });

      const updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: {
          owner_id: context.user.id,
        },
        include: {
          owner: true,
        },
      });

      return updatedItem;
    },
  },
};

export default itemResolvers;
