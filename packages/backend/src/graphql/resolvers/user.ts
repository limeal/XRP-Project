import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../../config';
import prisma from '../../prisma/client';

type CreateUserInput = {
  username: string;
  email: string;
  password: string;
  xrp_seed?: string | null;
};

const userResolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany({
        select: {
          id: true,
          username: true,
        },
      });
    },
    user: async (_: any, { id }: { id: string }) => {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
        },
      });
    },
  },
  Mutation: {
    signup: async (
      _: any,
      { username, email, password }: Omit<CreateUserInput, 'xrp_seed'>
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const xrp_seed = 'abcde';

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          xrp_seed,
        },
        select: {
          id: true,
          username: true,
        },
      });

      const token = jwt.sign({ id: user.id }, Buffer.from(config.jwt.secret), {
        expiresIn: config.jwt.expiresIn,
      } as SignOptions);

      return { token, user };
    },
    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          username: true,
          password: true,
        },
      });

      if (!user) throw new Error('User not found');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new Error('Invalid password');

      const token = jwt.sign({ id: user.id }, Buffer.from(config.jwt.secret), {
        expiresIn: config.jwt.expiresIn,
      } as SignOptions);

      // Utiliser un nom différent pour éviter le conflit
      const { password: pwd, ...publicUser } = user;
      return { token, user: publicUser };
    },
    updateUser: async (
      _: any,
      data: Partial<User> & { id: string },
      { user }: { user?: User }
    ) => {
      if (!user) throw new Error('Not authenticated');
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      return await prisma.user.update({
        where: { id: data.id },
        data,
        select: {
          id: true,
          username: true,
        },
      });
    },
    deleteUser: async (
      _: any,
      { id }: { id: string },
      { user }: { user?: User }
    ) => {
      if (!user) throw new Error('Not authenticated');
      return await prisma.user.delete({
        where: { id },
        select: {
          id: true,
          username: true,
        },
      });
    },
  },
  User: {
    items: async (parent: any) => {
      return await prisma.item.findMany({
        where: { owner_id: parent.id },
        include: {
          prices: {
            orderBy: { created_at: 'desc' },
            take: 1,
          },
        },
      });
    },
  },
};

export default userResolvers;
