import prisma from '../../prisma/client';

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
          entity_type: 'ITEM',
          entity_id: parent.id 
        },
      });
    },
    tags: async (parent: any) => {
      return await prisma.tag.findMany({
        where: { 
          entity_type: 'ITEM',
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
    createItem: async (_: any, { 
      name,
      description,
      xrp_id,
      image,
      owner_id
    }: {
      name: string;
      description: string;
      xrp_id?: string;
      image: string;
      owner_id: string;
    }) => {
      // TODO: Call createNFTToken
      return await prisma.item.create({
        data: {
          name,
          description,
          xrp_id,
          image,
          owner_id
        },
      });
    },
    updateItem: async (_: any, {
      id,
      name,
      description,
      xrp_id,
      image,
      owner_id
    }: {
      id: string;
      name?: string;
      description?: string;
      xrp_id?: string;
      image?: string;
      owner_id?: string;
    }) => {
      return await prisma.item.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(xrp_id && { xrp_id }),
          ...(image && { image }),
          ...(owner_id && { owner_id })
        },
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