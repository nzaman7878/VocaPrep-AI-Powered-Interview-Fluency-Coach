import { chromaClient } from '../config/chromaClient.js';
import { logger } from '../config/logger.js';

const COLLECTION_NAME = 'interview_sessions';

class RetrievalService {
  async getCollection() {
    try {
      return await chromaClient.getCollection({ name: COLLECTION_NAME });
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        logger.warn('ChromaDB collection not found or not initialized yet.');
      }
      return null;
    }
  }

  /**
   * Retrieves the top weakest areas (lowest scoring attempts) for a user.
   * @param {string} userId - The user's ID
   * @param {number} limit - Number of past weak topics to return (Top-K)
   * @returns {Promise<Array>} Array of weakest attempts
   */
  async getWeakAreas(userId, limit = 3) {
    try {
      const collection = await this.getCollection();
      if (!collection) return [];

      // Fetch all attempts for the user to sort them by score.
      // For larger datasets, we would apply a threshold filter like:
      // where: { "$and": [{ userId: userId.toString() }, { contentScore: { "$lt": 70 } }] }
      const response = await collection.get({
        where: { userId: userId.toString() },
      });

      if (!response || !response.metadatas || response.metadatas.length === 0) {
        return [];
      }

      // Combine metadata and documents for easy sorting
      const attempts = response.metadatas.map((meta, index) => ({
        id: response.ids[index],
        metadata: meta,
        document: response.documents[index],
      }));

      // Sort by contentScore ascending (lowest first)
      attempts.sort((a, b) => (a.metadata.contentScore || 0) - (b.metadata.contentScore || 0));

      // Return the top K weakest attempts
      return attempts.slice(0, limit);
    } catch (error) {
      logger.error('Error retrieving weak areas from ChromaDB:', error);
      return [];
    }
  }
}

export const retrievalService = new RetrievalService();
