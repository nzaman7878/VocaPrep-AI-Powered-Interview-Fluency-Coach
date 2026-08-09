import { ChromaClient } from 'chromadb';
import { logger } from './logger.js';
import { env } from './env.js';

const chromaUrl = env.CHROMA_URL || 'http://localhost:8000';

class ChromaDatabase {
  constructor() {
    this.client = new ChromaClient({ path: chromaUrl });
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;

    try {
      // Send a heartbeat to verify connection
      const heartbeat = await this.client.heartbeat();
      logger.info(`ChromaDB connected successfully at ${chromaUrl}. Heartbeat: ${heartbeat}`);
      this.isConnected = true;
    } catch (error) {
      logger.error(`Error connecting to ChromaDB at ${chromaUrl}:`, error.message);
      // We don't throw here to prevent server crash if Chroma is down.
      // We can retry or handle gracefully during query time.
    }
  }

  getClient() {
    return this.client;
  }
}

export const chromaDb = new ChromaDatabase();
export const chromaClient = chromaDb.getClient();
