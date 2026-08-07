/**
 * Analyzes speech pauses based on the gaps between word timestamps.
 *
 * Algorithm rules:
 * - Gap > 500ms = short pause
 * - Gap > 1500ms = long pause
 * - Hesitation pause = a pause that occurs without ending punctuation (., ?, !)
 *
 * @param {Array<{text: string, start: number, end: number}>} words - Array of transcribed words with timestamps
 * @returns {Object} Comprehensive pause metrics
 */
export const analyzePauses = (words = []) => {
  const metrics = {
    totalPauses: 0,
    shortPauses: 0,
    longPauses: 0,
    hesitationPauses: 0,
    averagePauseLength: 0, // in milliseconds
    longestPause: 0, // in milliseconds
    pausePositions: [], // detailed tracking for UI timeline highlights
  };

  if (!words || words.length < 2) {
    return metrics;
  }

  let totalPauseDuration = 0;

  for (let i = 0; i < words.length - 1; i++) {
    const currentWord = words[i];
    const nextWord = words[i + 1];

    // Calculate the gap in milliseconds between the end of one word and the start of the next
    const gapMs = nextWord.start - currentWord.end;

    // Only register gaps larger than 0.5s (500ms)
    if (gapMs > 500) {
      metrics.totalPauses++;
      totalPauseDuration += gapMs;

      // Update longest pause
      if (gapMs > metrics.longestPause) {
        metrics.longestPause = gapMs;
      }

      // Categorize by duration
      let type = 'short';
      if (gapMs > 1500) {
        type = 'long';
        metrics.longPauses++;
      } else {
        metrics.shortPauses++;
      }

      // Detect context: sentence ending vs hesitation
      // We check if the current word ends with terminal punctuation
      const text = currentWord.text.trim();
      const isEndOfSentence = /[.?!]$/.test(text);
      const isHesitation = !isEndOfSentence;

      if (isHesitation) {
        metrics.hesitationPauses++;
      }

      metrics.pausePositions.push({
        start: currentWord.end,
        end: nextWord.start,
        duration: gapMs,
        type,
        isHesitation,
        afterWordIndex: i, // Used to map the pause location back to the transcript array
      });
    }
  }

  // Calculate the average pause length
  if (metrics.totalPauses > 0) {
    metrics.averagePauseLength = Math.round(totalPauseDuration / metrics.totalPauses);
  }

  return metrics;
};
