import { mistralLlm } from '../llmClient.js';
import { deliveryEvaluatorPrompt } from '../prompts/deliveryEvaluatorPrompt.js';
import { calculateWPM } from '../delivery/wpmCalculator.js';
import { detectFillers } from '../delivery/fillerDetector.js';
import { analyzePauses } from '../delivery/pauseAnalyzer.js';
import { detectRunOnSentences } from '../delivery/runOnDetector.js';

/**
 * LangGraph Node: Delivery Evaluator
 *
 * Orchestrates the delivery evaluation pipeline. First, it computes hard,
 * deterministic metrics using our utility calculators. Then, it feeds those
 * metrics to the Mistral LLM for human-readable interpretation and scoring.
 *
 * @param {Object} state - The current LangGraph InterviewEvaluationState
 * @returns {Object} Partial state update containing the `deliveryEvaluation`
 */
export const evaluateDeliveryNode = async (state) => {
  const { wordTimestamps } = state;

  // Handle edge case where no audio/transcript was recorded
  if (!wordTimestamps || wordTimestamps.length === 0) {
    return {
      deliveryEvaluation: {
        wpm: 0,
        fillerCount: 0,
        fillerRate: 0,
        pauseCount: 0,
        avgPauseLength: 0,
        longestPause: 0,
        interpretation: {
          score: 0,
          pacingScore: 0,
          fluencyScore: 0,
          feedback: 'No audio was provided to evaluate delivery.',
        },
      },
    };
  }

  // 1. Pipeline: Compute hard metrics deterministically
  const wpm = calculateWPM(wordTimestamps);
  const { fillerCount, fillerRate } = detectFillers(wordTimestamps);
  const pauseMetrics = analyzePauses(wordTimestamps);
  const runOnMetrics = detectRunOnSentences(wordTimestamps);

  const totalPauses = pauseMetrics.totalPauses;
  const hesitationPauses = pauseMetrics.hesitationPauses;
  const avgPauseLength = pauseMetrics.averagePauseLength;
  const longestPause = pauseMetrics.longestPause;
  const runOnCount = runOnMetrics.runOnCount;

  // 2. Pipeline: Feed metrics to LLM for interpretation
  const chain = deliveryEvaluatorPrompt.pipe(mistralLlm);

  const response = await chain.invoke({
    wpm,
    fillerRate,
    totalPauses,
    hesitationPauses,
    runOnCount,
  });

  let interpretation;
  try {
    let rawContent = response.content.trim();
    // Sanitize any hallucinated markdown blocks
    if (rawContent.startsWith('```json')) {
      rawContent = rawContent
        .replace(/^```json/, '')
        .replace(/```$/, '')
        .trim();
    } else if (rawContent.startsWith('```')) {
      rawContent = rawContent.replace(/^```/, '').replace(/```$/, '').trim();
    }
    interpretation = JSON.parse(rawContent);
  } catch (error) {
    console.error('[DeliveryEvaluator] Failed to parse JSON response:', response.content);
    // Graceful fallback
    interpretation = {
      score: 5,
      pacingScore: 5,
      fluencyScore: 5,
      feedback:
        'System successfully computed delivery metrics, but the AI failed to generate human-readable feedback.',
    };
  }

  // 3. Output mapping matching the requested schema
  return {
    deliveryEvaluation: {
      wpm,
      fillerCount,
      fillerRate,
      pauseCount: totalPauses,
      avgPauseLength,
      longestPause,
      interpretation: {
        score: interpretation.score || 0,
        pacingScore: interpretation.pacingScore || 0,
        fluencyScore: interpretation.fluencyScore || 0,
        feedback: interpretation.feedback || '',
      },
    },
  };
};
