import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { typeDefs, resolvers } from './graphql';
import logger from './utils/logger';

async function createApolloServer(app: express.Application) {
  const httpServer = http.createServer(app);
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error: any) => {
      logger.error(error);
      return error;
    },
  });
  await server.start();
  
  // Apply middleware after server has started
  // Using type assertion to bypass type incompatibility issues
  app.use(
    '/graphql', 
    cors(),
    express.json(), 
    expressMiddleware(server, {
      context: async ({ req }) => {
        // You can add authentication logic here
        return { req };
      },
    }) as any
  );
  
  return { server, httpServer };
}

function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));
  app.use(morgan('dev'));
  app.use(express.json());
  
  return app;
}

export { createApp, createApolloServer };
