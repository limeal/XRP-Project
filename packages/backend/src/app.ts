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
import path from 'path';

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

  // Global Middleware - configure une seule fois au début
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'], // Pour les téléchargements
  }));

  app.use(helmet({
    contentSecurityPolicy: false, // Désactiver pour le développement
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  app.use(morgan('dev'));
  app.use(express.json());

  // Serve uploaded files - doit être après CORS et Helmet
  const uploadsPath = path.join(__dirname, '../uploads');
  console.log('Serving uploads from:', uploadsPath);

  app.use('/uploads', (req, res, next) => {
    console.log('Accessing file:', req.url);
    next();
  }, express.static(uploadsPath));

  return app;
}

export { createApp, createApolloServer };
