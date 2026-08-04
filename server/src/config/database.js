import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

const MAX_RETRIES = 5;
let currentRetry = 0;

export const connectDB = async () => {
  if (!env.MONGODB_URI) {
    logger.error('Error: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(env.MONGODB_URI);
      logger.info('MongoDB connected successfully');
    } catch (error) {
      logger.error(`MongoDB connection error: ${error.message}`);
      currentRetry += 1;
      if (currentRetry < MAX_RETRIES) {
        logger.info(`Retrying connection (${currentRetry}/${MAX_RETRIES}) in 5 seconds...`);
        setTimeout(connectWithRetry, 5000);
      } else {
        logger.error('Failed to connect to MongoDB after maximum retries. Exiting...');
        process.exit(1);
      }
    }
  };

  await connectWithRetry();
};

// Connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected!');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error event: ${err.message}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});
