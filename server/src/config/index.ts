import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'production' &&
    (!process.env.JWT_SECRET || ['default-secret-change-me', 'your-secret-key-change-in-production'].includes(process.env.JWT_SECRET))) {
  throw new Error('A private JWT_SECRET must be configured for production.');
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
};
