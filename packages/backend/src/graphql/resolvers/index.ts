const resolvers = {
  Query: {
    users: async () => {
      return [
        {
          id: '1',
          email: 'test@test.com',
          name: 'Test',
        },
      ];
    },
    user: async (_: any, { id }: { id: string }) => {
      return {
        id: '1',
        email: 'test@test.com',
        name: 'Test',
      };
    },
  },
  Mutation: {
    createUser: async (_: any, { email, name }: { email: string; name?: string }) => {
     console.log('createUser', email, name);
    },
    updateUser: async (_: any, { id, email, name }: { id: string; email?: string; name?: string }) => {
        console.log('updateUser', id, email, name);
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
        console.log('deleteUser', id);
    },
  },
};

export default resolvers; 