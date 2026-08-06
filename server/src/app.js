import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
); // CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // HTTP request logger
}

// Routes - placeholders
app.get('/', (req, res) => {
  res.send('VocaPrep API is running...');
});

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import audioRoutes from './routes/audioRoutes.js';

// API Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/audio', audioRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
