import prisma from '../../prisma/client';

const tagResolvers = {
  Query: {
    tags: async () => {
      return await prisma.tag.findMany();
    },
    tag: async (_: any, { id }: { id: string }) => {
      return await prisma.tag.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createTag: async (_: any, { 
      entity_type,
      entity_id,
      title
    }: {
      entity_type: string;
      entity_id: string;
      title: string;
    }) => {
      return await prisma.tag.create({
        data: {
          entity_type,
          entity_id,
          title
        },
      });
    },
    updateTag: async (_: any, {
      id,
      title
    }: {
      id: string;
      title?: string;
    }) => {
      return await prisma.tag.update({
        where: { id },
        data: {
          ...(title && { title })
        },
      });
    },
    deleteTag: async (_: any, { id }: { id: string }) => {
      return await prisma.tag.delete({
        where: { id },
      });
    },
  },
}; 

export default tagResolvers;