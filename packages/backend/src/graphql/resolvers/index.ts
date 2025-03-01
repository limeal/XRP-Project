import prisma from '../../prisma/client';

const resolvers = {
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
    createUser: async (_: any, { email, name }: { email: string; name?: string }) => {
      return await prisma.user.create({
        data: {
          email,
          name,
        },
      });
    },
    updateUser: async (_: any, { id, email, name }: { id: string; email?: string; name?: string }) => {
      return await prisma.user.update({
        where: { id },
        data: {
          ...(email && { email }),
          ...(name && { name }),
        },
      });
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      return await prisma.user.delete({
        where: { id },
      });
    },
  },
};

export default resolvers; 