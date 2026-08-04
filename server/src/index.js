import app from './app.js';
import { env } from './config/env.js';

const startServer = () => {
  try {
    const PORT = env.PORT;
    
    // Connect to database in later modules (Module 7)
    // await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server is running in ${env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
