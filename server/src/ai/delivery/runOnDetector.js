/**
 * Detects run-on sentences in a transcript based on word count, punctuation, and pauses.
 *
 * A segment of speech is evaluated as a "sentence" until a boundary is hit.
 * A boundary is defined as:
 * 1. Terminal punctuation (., ?, !)
 * 2. A significant pause (> 1000ms), acting as a natural breath.
 *
 * If a sentence exceeds the max word threshold without a boundary, it's flagged as run-on.
 *
 * @param {Array<{text: string, start: number, end: number}>} words - Transcribed words
 * @param {number} maxWordsPerSentence - Threshold for flagging (default 35 words)
 * @returns {Object} { runOnCount, runOnPositions }
 */
export const detectRunOnSentences = (words = [], maxWordsPerSentence = 35) => {
  const metrics = {
    runOnCount: 0,
    runOnPositions: [], // For UI highlighting
  };

  if (!words || words.length === 0) {
    return metrics;
  }

  let currentSentenceStartIndex = 0;
  let currentWordCount = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    currentWordCount++;

    const text = word.text.trim();
    // Check if AssemblyAI attached terminal punctuation to this word
    const hasTerminalPunctuation = /[.?!]$/.test(text);

    // Check if there is a significant breathing pause after this word
    let hasSignificantPause = false;
    if (i < words.length - 1) {
      const nextWord = words[i + 1];
      const gapMs = nextWord.start - word.end;
      if (gapMs > 1000) {
        hasSignificantPause = true;
      }
    }

    // A boundary resets the sentence counter
    const isBoundary = hasTerminalPunctuation || hasSignificantPause || i === words.length - 1;

    if (isBoundary) {
      // Evaluate if the segment we just finished was too long
      if (currentWordCount > maxWordsPerSentence) {
        metrics.runOnCount++;
        metrics.runOnPositions.push({
          startWordIndex: currentSentenceStartIndex,
          endWordIndex: i,
          wordCount: currentWordCount,
          start: words[currentSentenceStartIndex].start,
          end: word.end,
        });
      }

      // Reset tracker for the next sentence
      currentSentenceStartIndex = i + 1;
      currentWordCount = 0;
    }
  }

  return metrics;
};
