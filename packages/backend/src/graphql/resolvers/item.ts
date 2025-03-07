import { EntityType, Item } from '@prisma/client';
import { Context } from '../../app';
import prisma from '../../prisma/client';
import { storage } from '../../services/storage';
import { XRPClient } from '../../xrpl/xrp-client';
import { FileUpload } from 'graphql-upload-ts';
import { XRPToken } from '../../xrpl/xrp-token';

const itemResolvers = {
  Query: {
    items: async () => {
      return prisma.item.findMany();
    },
    item: async (_: any, { id }: { id: string }) => {
      return prisma.item.findUnique({
        where: { id },
      });
    },
    userItems: async (_: any, { userId }: { userId: string }) => {
      return prisma.item.findMany({
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
      return prisma.item.findMany({
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
      return prisma.user.findUnique({
        where: { id: parent.owner_id },
      });
    },
    comments: async (parent: any) => {
      return prisma.comment.findMany({
        where: {
          entity_type: EntityType.ITEM,
          entity_id: parent.id,
        },
      });
    },
    tags: async (parent: any) => {
      return prisma.tag.findMany({
        where: {
          entity_type: EntityType.ITEM,
          entity_id: parent.id,
        },
      });
    },
    prices: async (parent: any) => {
      return prisma.itemPrice.findMany({
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
      { name, description, image }: { name: string; description: string; image: FileUpload },
      context: Context
    ) => {
      try {
        if (!context.user) {
          throw new Error('You must be logged in to create an item');
        }

        // Sauvegarder l'image avec le nom de l'item
        const imageUrl = await storage.saveFile(image, name);

        // Créer l'item
        const item = await prisma.item.create({
          data: {
            name,
            description,
            image_url: imageUrl,
            owner_id: context.user.id,
          },
        });

        return item;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Failed to create item: ${error.message}`);
        }
        throw new Error('Failed to create item: Unknown error');
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
    buyItem: async (
      _: any,
      { itemId }: { itemId: string },
      context: Context
    ) => {
      const { user, xrpHeaders } = context;
      if (!user || !xrpHeaders) {
        throw new Error('Not authenticated');
      }

      const item = await prisma.item.findUnique({
        where: { id: itemId, owner_id: { not: user.id } },
        include: {
          prices: true,
        },
      });

      if (!item || !item.prices.length || !item.prices[0].offer_xrp_id) {
        throw new Error('Item not found or not for sale');
      }

      const xrpClient = new XRPClient(xrpHeaders.address);
      await xrpClient.acceptOfferForToken(
        'sell',
        item.prices[0].offer_xrp_id,
      );

      return prisma.$transaction([
        prisma.itemPrice.deleteMany({
          where: { item_id: itemId },
        }),
        prisma.item.update({
          where: { id: itemId },
          data: { owner_id: user.id },
        }),
      ]);
    },
    publishItem: async (
      _: any,
      { itemId }: { itemId: string },
      context: Context
    ) => {
      if (!context.user || !context.user.is_superadmin || !context.xrpHeaders)
        throw new Error('Not authorized');

      const item = await prisma.item.findUnique({
        where: { id: itemId },
      });

      if (!item)
        throw new Error('Item not found');

      const xrpClient = new XRPClient(context.xrpHeaders?.address);
      await xrpClient.createNFTToken(new XRPToken(item));

      return prisma.item.update({
        where: { id: itemId },
        data: { published: true },
        select: {
          id: true,
          name: true,
          published: true,
          owner_id: true,
        },
      });
    },
  },
};

export default itemResolvers;
