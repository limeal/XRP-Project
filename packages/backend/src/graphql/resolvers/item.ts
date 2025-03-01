import { EntityType, Item } from '@prisma/client';
import prisma from '../../prisma/client';
import { XRPClient } from '../../xrpl/xrp-client';
import { Context } from '../../app';
import { XRPToken } from '../../xrpl/xrp-token';

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
    createItem: async (_: any, data: Omit<Item, 'id' | 'owner_id'>, context: Context) => {
      const user = context.user;
      if (!user || !user.xrp_seed) {
        throw new Error('User not found');
      }

      const xrpClient = new XRPClient();
      const token = await xrpClient.createNFTToken(user.xrp_seed, new XRPToken(data));

      return prisma.item.create({
        data: {
          ...data,
          xrp_id: `${token.id}`,
          owner: {
            connect: {
              id: user?.id
            }
          }
        },
      });
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