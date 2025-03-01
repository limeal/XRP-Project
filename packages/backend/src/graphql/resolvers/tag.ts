import { Tag } from '@prisma/client';
import prisma from '../../prisma/client';
import { Context } from '../../app';

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
    createTag: async (_: any, data: Omit<Tag, 'id'>, context: Context) => {
      const user = context.user;
      if (!user) {
        throw new Error('User not found');
      }

      return await prisma.tag.create({
        data,
      });
    },
    updateTag: async (_: any, data: Partial<Omit<Tag, 'id'>> & { id: string }) => {
      return await prisma.tag.update({
        where: { id: data.id },
        data,
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