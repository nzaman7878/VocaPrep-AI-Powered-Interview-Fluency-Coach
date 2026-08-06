/**
 * Calculates Words Per Minute (WPM) based on precise word-level timestamps.
 *
 * @param {Array<{text: string, start: number, end: number}>} words - Array of word objects from transcription service (timestamps in milliseconds)
 * @returns {number} The calculated WPM, rounded to the nearest integer
 */
export const calculateWPM = (words = []) => {
  if (!words || words.length === 0) {
    return 0;
  }

  const totalWords = words.length;

  const firstWordStart = words[0].start;
  const lastWordEnd = words[totalWords - 1].end;

  // Calculate total speaking duration in milliseconds
  const durationMs = lastWordEnd - firstWordStart;

  // Safety check to prevent division by zero for corrupted timestamps
  if (durationMs <= 0) {
    return 0;
  }

  // Convert duration to minutes
  const durationMinutes = durationMs / 1000 / 60;

  // Calculate raw WPM
  const wpm = totalWords / durationMinutes;

  return Math.round(wpm);
};
