import { Context } from '../../app';
import prisma from '../../prisma/client';
import { Comment } from '@prisma/client';

const commentResolvers = {
  Query: {
    comments: async () => {
      return await prisma.comment.findMany();
    },
    comment: async (_: any, { id }: { id: string }) => {
      return await prisma.comment.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createComment: async (_: any, data: Omit<Comment, 'id'>, context: Context) => {
      const user = context.user;

      if (!user && data.entity_type === 'USER') {
        throw new Error('User not found');
      }

      return prisma.item.update({
        where: { id: data.entity_id },
        data: {
          comments: {
            create: {
              body: data.body,
              entity_type: data.entity_type,
            },
          },
        },
      });
    },
    updateComment: async (_: any, data: Partial<Omit<Comment, 'id'>> & { id: string }) => {
      return await prisma.comment.update({
        where: { id: data.id },
        data,
      });
    },
    deleteComment: async (_: any, { id }: { id: string }) => {
      return await prisma.comment.delete({
        where: { id },
      });
    },
  },
};

export default commentResolvers;