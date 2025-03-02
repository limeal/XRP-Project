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
import { User } from '@prisma/client';
import passport from 'passport';
import './config/passport';
import { RequestHandler } from 'express';

export type Context = {
  req: express.Request;
  user?: User;
}

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
  
  app.use(passport.initialize() as RequestHandler);
  
  app.use(
    '/graphql', 
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Vérifier le token JWT
        return new Promise((resolve) => {
          passport.authenticate('jwt', { session: false }, (err: Error | null, user: User | false) => {
            if (err || !user) {
              resolve({ req, user: undefined });
            } else {
              resolve({ req, user: user as User });
            }
          })(req);
        });
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
