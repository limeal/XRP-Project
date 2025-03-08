import { ItemPrice } from '@prisma/client';
import { Context } from '../../app';
import prisma from '../../prisma/client';
import { XRPClient } from '../../xrpl/xrp-client';

const itemPriceResolvers = {
  Query: {
    itemPrices: async () => {
      return await prisma.itemPrice.findMany();
    },
    itemPrice: async (_: any, { id }: { id: string }) => {
      return await prisma.itemPrice.findUnique({
        where: { id },
      });
    },
  },
  ItemPrice: {
    item: async (parent: any) => {
      return await prisma.item.findUnique({
        where: { id: parent.item_id },
      });
    },
    price: (parent: any) => parent.price.toString(),
  },
  Mutation: {
    createItemPrice: async (
      _: any,
      data: Pick<ItemPrice, 'item_id' | 'price'>,
      context: Context
    ) => {
      const { user } = context;
      if (!user) {
        throw new Error('User not found');
      }

      const item = await prisma.item.findUnique({
        where: { id: data.item_id },
        select: {
          xrp_id: true,
        },
      });

      if (!item) {
        throw new Error('Item not found');
      }

      const xrpClient = new XRPClient();
      const offer_id = await xrpClient.createOfferForToken(
        'sell',
        `${data.price}`,
        item.xrp_id ?? ''
      );

      return await prisma.itemPrice.create({
        data: {
          ...data,
          offer_xrp_id: offer_id,
        },
      });
    },
    updateItemPrice: async (
      _: any,
      data: Partial<Omit<ItemPrice, 'id'>> & { id: string }
    ) => {
      return await prisma.itemPrice.update({
        where: { id: data.id },
        data,
      });
    },
    deleteItemPrice: async (_: any, { id }: { id: string }) => {
      return await prisma.itemPrice.delete({
        where: { id },
      });
    },
  },
};

export default itemPriceResolvers;
