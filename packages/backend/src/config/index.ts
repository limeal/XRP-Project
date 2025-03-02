import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || (() => {
      throw new Error('JWT_SECRET environment variable is required');
    })(),
    expiresIn: '1d',
  },
};

export default config;
