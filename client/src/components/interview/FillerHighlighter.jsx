import React from 'react';

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
 * Visually highlights filler words within a block of transcript text.
 */
const FillerHighlighter = ({ text = '', className = '' }) => {
  if (!text) return null;

  // Sort filler words by length descending to match multi-word phrases first
  const sortedFillers = [...FILLER_WORDS].sort((a, b) => b.length - a.length);

  // Build a regex to match filler words (case insensitive, whole words only)
  const regexPattern = new RegExp(`\\b(${sortedFillers.join('|')})\\b`, 'gi');

  // Split text by the regex. The capture group ensures the matched word is included in the array.
  const parts = text.split(regexPattern);

  return (
    <div className={`leading-relaxed text-text-primary dark:text-gray-200 ${className}`}>
      {parts.map((part, index) => {
        const isFiller = sortedFillers.includes(part.toLowerCase());

        if (isFiller) {
          return (
            <span
              key={index}
              className="px-1.5 py-0.5 mx-0.5 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 font-medium transition-colors hover:bg-yellow-200 dark:hover:bg-yellow-900/50 cursor-help"
              title="Filler word"
            >
              {part}
            </span>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export default FillerHighlighter;
