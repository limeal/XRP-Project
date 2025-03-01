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
    createUser: async (_: any, { 
      username, 
      email, 
      password,
      xrp_address 
    }: { 
      username: string;
      email: string;
      password: string;
      xrp_address?: string;
    }) => {
      // TODO: Encrypt password before saving

      // TODO: Call createTestnetAccount

      return await prisma.user.create({
        data: {
          username,
          email,
          password,
          xrp_address,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    },
    updateUser: async (_: any, { 
      id, 
      username,
      email,
      password,
      xrp_address,
      last_login_at
    }: { 
      id: string;
      username?: string;
      email?: string;
      password?: string;
      xrp_address?: string;
      last_login_at?: Date;
    }) => {
      return await prisma.user.update({
        where: { id },
        data: {
          ...(username && { username }),
          ...(email && { email }),
          ...(password && { password }),
          ...(xrp_address && { xrp_address }),
          ...(last_login_at && { last_login_at }),
          updated_at: new Date(),
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

export default userResolvers; 