import express, { Application, Request } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import { typeDefs, resolvers } from './graphql';
import logger from './utils/logger';

import { expressMiddleware } from '@apollo/server/express4';

async function createApolloServer(app: Application) {
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error: any) => {
      logger.error(error);
      return {
        message: error.message,
        extensions: error.extensions,
      };
    },
  });

  try {
    await server.start();
  } catch (err) {
    logger.error('Failed to start Apollo Server:', err);
    throw err;
  }

  app.use(
    '/graphql',
    cors({ origin: '*' }), // Adjust as needed for security
    express.json(),
    expressMiddleware(server, { context: async ({ req }) => ({ req }) }) as any,
  );

  return { server, httpServer };
}

function createApp(): Application {
  const app = express();

  // Initialize JSON parsing middleware early
  app.use(express.json());

  // Security & logging middlewares
  app.use(cors());
  app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));
  app.use(morgan('dev'));

  return app;
}

export { createApp, createApolloServer };
