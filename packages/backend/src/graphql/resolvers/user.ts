import { User } from '@prisma/client';
import prisma from '../../prisma/client';

const userResolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    user: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    updateUser: async (_: any, data: Partial<User> & { id: string }) => {
      return await prisma.user.update({
        where: { id: data.id },
        data,
      });
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      return await prisma.user.delete({
        where: { id },
      });
    },
  },
};

export default userResolvers; 