import React, { useState, useEffect, useRef } from 'react';

const TranscriptDisplay = ({
  words = [],
  autoPlay = true,
  playbackTime = null, // Can be used to sync with a real HTMLAudioElement
  className = '',
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    // If no words, or we are relying on external playbackTime, do not self-animate
    if (!autoPlay || words.length === 0 || playbackTime !== null) {
      return;
    }

    // Self-contained animation to simulate the transcript being read out loud
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      setElapsedTime(elapsed);

      const lastWord = words[words.length - 1];
      // Continue animation until 1 second past the last word's end timestamp
      if (lastWord && elapsed < lastWord.end + 1000) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Reset timers when words change
    startTimeRef.current = null;
    setElapsedTime(0);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [words, autoPlay, playbackTime]);

  // Use external time if provided, otherwise fallback to the internal animation time
  const currentTime = playbackTime !== null ? playbackTime : elapsedTime;

  if (!words || words.length === 0) {
    return null;
  }

  return (
    <div
      className={`p-6 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-border-light dark:border-border-dark shadow-sm leading-relaxed text-lg ${className}`}
    >
      <div className="flex flex-wrap">
        {words.map((wordObj, index) => {
          // A word has appeared if current time is past its start time
          const hasAppeared = currentTime >= wordObj.start;

          // A word is currently being spoken
          const isCurrentlySpoken = currentTime >= wordObj.start && currentTime <= wordObj.end;

          return (
            <span
              key={index}
              className={`
                mr-1.5 mb-1 transition-all duration-300 transform
                ${hasAppeared ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                ${isCurrentlySpoken ? 'text-primary-600 dark:text-primary-400 font-medium scale-105' : 'text-text-primary dark:text-gray-300'}
              `}
              style={{
                // Staggered delay fallback just in case, though the JS time drives it cleanly
                transitionDelay: isCurrentlySpoken ? '0ms' : '100ms',
              }}
            >
              {wordObj.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TranscriptDisplay;
