import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from the server/.env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  // 'GEMINI_API_KEY', // Commented out for now so it doesn't crash on initial run without real keys
  // 'ASSEMBLYAI_API_KEY'
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.warn(`[Warning]: Environment variable ${envVar} is missing.`);
  }
});

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  CHROMA_URL: process.env.CHROMA_URL || 'http://localhost:8000',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
