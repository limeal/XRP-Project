import prisma from '../../prisma/client';

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
    createComment: async (_: any, { 
      entity_type,
      entity_id,
      body
    }: {
      entity_type: string;
      entity_id: string;
      body: string;
    }) => {
      return await prisma.comment.create({
        data: {
          entity_type,
          entity_id,
          body
        },
      });
    },
    updateComment: async (_: any, {
      id,
      body
    }: {
      id: string;
      body?: string;
    }) => {
      return await prisma.comment.update({
        where: { id },
        data: {
          ...(body && { body })
        },
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