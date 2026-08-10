import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatMistralAI } from '@langchain/mistralai';
import { env } from '../config/env.js';

if (!env.GEMINI_API_KEY) {
  console.warn(
    '[Warning]: GEMINI_API_KEY is missing from environment variables. AI generation will fail.'
  );
}

if (!env.MISTRAL_API_KEY) {
  console.warn(
    '[Warning]: MISTRAL_API_KEY is missing from environment variables. AI evaluations will fail.'
  );
}

/**
 * Singleton instance of the Gemini LLM client.
 * Configured specifically for structured output and analytical evaluation tasks.
 */
export const llm = new ChatGoogleGenerativeAI({
  apiKey: env.GEMINI_API_KEY,
  model: 'gemini-3.5-flash',
  maxOutputTokens: 2048,
  temperature: 0.2, // Low temperature for consistent, reliable scoring and feedback
});

/**
 * Singleton instance of the Mistral LLM client.
 * Configured specifically for structured output and analytical evaluation tasks.
 */
export const mistralLlm = new ChatMistralAI({
  apiKey: env.MISTRAL_API_KEY,
  modelName: 'mistral-large-latest',
  temperature: 0.2, // Low temperature for consistent, reliable scoring and feedback
});
