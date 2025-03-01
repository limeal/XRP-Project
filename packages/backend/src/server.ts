import { createApp, createApolloServer } from './app';
import config from './config';
import logger from './utils/logger';

async function bootstrap() {
  try {
    const app = createApp();
    const { httpServer } = await createApolloServer(app);
    
    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(`GraphQL endpoint: http://localhost:${config.port}/graphql`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap(); 