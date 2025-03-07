import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { User } from '@prisma/client';
import cors from 'cors';
import express, { RequestHandler } from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import './config/passport';
import { resolvers, typeDefs } from './graphql';
import logger from './utils/logger';
import { graphqlUploadExpress } from "graphql-upload-ts";

export type Context = {
  req: express.Request;
  user?: User;
  xrpHeaders?: {
    address: string;
    mnemonic: string;
  };
};

async function createApolloServer(app: express.Application) {
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers as any,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error: any) => {
      logger.error(error);
      return error;
    },
    csrfPrevention: true,
  });
  await server.start();

  app.use(passport.initialize() as RequestHandler);

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const xrpHeaders = {
          address: req.headers['x-xrp-address'] as string,
          mnemonic: req.headers['x-xrp-mnemonic'] as string,
        };

        console.log('xrpHeaders', xrpHeaders);

        // Vérifier le token JWT
        return new Promise((resolve) => {
          passport.authenticate(
            'jwt',
            { session: false },
            (err: Error | null, user: User | false) => {
              if (err || !user) {
                resolve({ req, user: undefined, xrpHeaders: undefined });
              } else {
                resolve({ req, user: user as User, xrpHeaders });
              }
            }
          )(req);
        });
      },
    }) as any
  );

  return { server, httpServer };
}

function createApp() {
  const app = express();

  // Global Middleware - configure une seule fois au début
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Disposition'], // Pour les téléchargements
    })
  );

  app.use(
    helmet({
      contentSecurityPolicy: false, // Désactiver pour le développement
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(graphqlUploadExpress({
    maxFileSize: 10000000,
    maxFiles: 10,
    // If you are using framework around express like [ NestJS or Apollo Serve ]
    // use this options overrideSendResponse to allow nestjs to handle response errors like throwing exceptions
    overrideSendResponse: false
  }));

  // Serve uploaded files - doit être après CORS et Helmet
  const uploadsPath = path.join(__dirname, '../uploads');
  console.log('Serving uploads from:', uploadsPath);

  app.use(
    '/uploads',
    (req, res, next) => {
      console.log('Accessing file:', req.url);
      next();
    },
    express.static(uploadsPath)
  );

  return app;
}

export { createApolloServer, createApp };
