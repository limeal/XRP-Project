import prisma from '../../prisma/client';

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
  },
  Mutation: {
    createItemPrice: async (_: any, { 
      item_id,
      price
    }: {
      item_id: string;
      price: bigint;
    }) => {
      return await prisma.itemPrice.create({
        data: {
          item_id,
          price
        },
      });
    },
    updateItemPrice: async (_: any, {
      id,
      price
    }: {
      id: string;
      price: bigint;
    }) => {
      return await prisma.itemPrice.update({
        where: { id },
        data: {
          ...(price && { price })
        },
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