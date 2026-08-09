const FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'you know',
  'basically',
  'actually',
  'so',
  'right',
  'i mean',
  'kind of',
  'sort of',
];

/**
 * Detects filler words in the transcribed words array.
 * Supports detecting multi-word filler phrases (e.g., "you know").
 *
 * @param {Array<{text: string, start: number, end: number}>} words - Array of word objects from transcription
 * @returns {Object} { fillerCount, fillerRate, fillerPositions }
 */
export const detectFillers = (words = []) => {
  if (!words || words.length === 0) {
    return { fillerCount: 0, fillerRate: 0, fillerPositions: [] };
  }

  const fillerPositions = [];
  let fillerCount = 0;
  let i = 0;

  // Pre-clean words for easier matching (lowercase, strip punctuation)
  const cleanWords = words.map((w) => (w.text || '').toLowerCase().replace(/[.,!?]/g, ''));

  while (i < cleanWords.length) {
    let matched = false;

    // 1. Lookahead check for 2-word filler phrases
    if (i < cleanWords.length - 1) {
      const twoWordPhrase = `${cleanWords[i]} ${cleanWords[i + 1]}`;
      if (FILLER_WORDS.includes(twoWordPhrase)) {
        fillerCount++;
        fillerPositions.push({
          phrase: twoWordPhrase,
          start: words[i].start,
          end: words[i + 1].end,
          wordIndices: [i, i + 1],
        });
        i += 2; // Skip the next word since it was consumed by the phrase
        matched = true;
        continue;
      }
    }

    // 2. Check for single-word fillers
    if (!matched) {
      const singleWord = cleanWords[i];
      if (FILLER_WORDS.includes(singleWord)) {
        fillerCount++;
        fillerPositions.push({
          phrase: singleWord,
          start: words[i].start,
          end: words[i].end,
          wordIndices: [i],
        });
      }
      i++;
    }
  }

  // Calculate filler rate: filler_count / total_words × 100
  const fillerRate = (fillerCount / words.length) * 100;

  return {
    fillerCount,
    fillerRate: Number(fillerRate.toFixed(2)), // Round to 2 decimal places
    fillerPositions,
  };
};
