/**
 * Calculates Words Per Minute (WPM) based on precise word-level timestamps.
 *
 * @param {Array<{text: string, start: number, end: number}>} words - Array of word objects from transcription service (timestamps in milliseconds)
 * @returns {number} The calculated WPM, rounded to the nearest integer
 */
export const calculateWPM = (words = []) => {
  if (!words || words.length < 3) {
    // Too few words to accurately calculate a meaningful WPM
    return 0;
  }

  const totalWords = words.length;
  const firstWordStart = words[0].start;
  const lastWordEnd = words[totalWords - 1].end;

  // Calculate total speaking duration in milliseconds
  let durationMs = lastWordEnd - firstWordStart;

  // Enforce a minimum duration of 2 seconds (2000ms) to prevent division by near-zero 
  // which causes astronomically high WPM for very short, fast bursts of speech.
  if (durationMs < 2000) {
    durationMs = 2000;
  }

  // Convert duration to minutes
  const durationMinutes = durationMs / 1000 / 60;

  // Calculate raw WPM
  let wpm = totalWords / durationMinutes;

  // Cap the WPM at 350 to prevent crazy outliers from ruining dashboard charts
  if (wpm > 350) {
    wpm = 350;
  }

  return Math.round(wpm);
};
