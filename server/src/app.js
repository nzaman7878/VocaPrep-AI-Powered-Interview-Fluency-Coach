import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { env } from './config/env.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { globalLimiter, authLimiter, aiLimiter } from './middleware/rateLimiter.js';

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
); // CORS

// Apply global rate limiting
app.use('/api', globalLimiter);

import { webhookHandler } from './controllers/stripeController.js';

// Stripe Webhook MUST be mounted before express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json({ limit: '10mb' })); // Parse JSON bodies with a limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

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
import stripeRoutes from './routes/stripeRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import transcriptionRoutes from './routes/transcriptionRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import questionGenRoutes from './routes/questionGenRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// API Routes Setup
app.use('/api/auth', authLimiter, authRoutes); // Stricter limit on auth routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/transcription', transcriptionRoutes);
app.use('/api/evaluate', aiLimiter, evaluationRoutes); // Stricter limit on expensive AI evaluation
app.use('/api/questions', aiLimiter, questionGenRoutes); // Stricter limit on AI question generation

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
