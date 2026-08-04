import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/database.js';
import { logger } from './config/logger.js';

const startServer = async () => {
  try {
    const PORT = env.PORT;
    
    // Connect to database
    await connectDB();
    
    app.listen(PORT, () => {
      logger.info(`Server is running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
