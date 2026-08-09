import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { chromaClient } from '../config/chromaClient.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const COLLECTION_NAME = 'interview_sessions';

class EmbeddingService {
  constructor() {
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: env.GEMINI_API_KEY,
      modelName: 'text-embedding-004',
    });

    this.collection = null;
  }

  async getCollection() {
    if (this.collection) return this.collection;

    try {
      this.collection = await chromaClient.getOrCreateCollection({
        name: COLLECTION_NAME,
        metadata: { 'hnsw:space': 'cosine' },
      });
      return this.collection;
    } catch (error) {
      logger.error('Failed to get or create ChromaDB collection:', error);
      throw error;
    }
  }

  /**
   * Embeds a single question attempt from a session into ChromaDB.
   * @param {Object} session - The session object
   * @param {Object} question - The evaluated question attempt
   */
  async embedQuestionAttempt(session, question) {
    if (!env.GEMINI_API_KEY) {
      logger.warn('Skipping embedding: GEMINI_API_KEY not provided.');
      return;
    }

    try {
      const collection = await this.getCollection();

      const text = `
Question: ${question.questionText}
Transcript: ${question.transcript || 'No transcript'}
Feedback: ${question.feedback || 'No feedback'}
Strengths: ${(question.strengths || []).join(', ')}
Areas for Improvement: ${(question.areasForImprovement || []).join(', ')}
      `.trim();

      const documentId = question._id
        ? question._id.toString()
        : `q_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const metadata = {
        userId: session.userId.toString(),
        sessionId: session._id.toString(),
        role: session.role,
        questionType: question.questionType || 'general',
        contentScore: question.contentScore || 0,
        date: new Date().toISOString(),
      };

      const vector = await this.embeddings.embedQuery(text);

      await collection.add({
        ids: [documentId],
        embeddings: [vector],
        metadatas: [metadata],
        documents: [text],
      });

      logger.info(
        `Successfully embedded question attempt ${documentId} for session ${session._id}`
      );
    } catch (error) {
      logger.error('Error embedding question attempt:', error);
      // Not throwing error to prevent disrupting the core flow
    }
  }

  /**
   * Search for similar past answers for a given user based on a query
   */
  async searchSimilarPastAnswers(userId, queryText, limit = 3) {
    try {
      const collection = await this.getCollection();
      const queryVector = await this.embeddings.embedQuery(queryText);

      const results = await collection.query({
        queryEmbeddings: [queryVector],
        nResults: limit,
        where: { userId: userId.toString() },
      });

      return results;
    } catch (error) {
      logger.error('Error searching ChromaDB:', error);
      return null;
    }
  }
}

export const embeddingService = new EmbeddingService();
