import { useState, useCallback } from 'react';

/**
 * Custom hook to add automatic retry logic with exponential backoff to async functions
 *
 * @param {Function} asyncFn - The async function to execute
 * @param {number} maxRetries - Maximum number of retries before failing
 * @param {number} initialDelay - Initial delay in ms (doubles on each retry)
 * @returns {Object} { execute, error, isRetrying, attempt, resetError }
 */
const useRetry = (asyncFn, maxRetries = 3, initialDelay = 1000) => {
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const execute = useCallback(
    async (...args) => {
      setError(null);
      setIsRetrying(false);
      setAttempt(0);

      for (let i = 0; i <= maxRetries; i++) {
        try {
          if (i > 0) setIsRetrying(true);
          setAttempt(i + 1);

          const result = await asyncFn(...args);

          setIsRetrying(false);
          return result;
        } catch (err) {
          if (i === maxRetries) {
            setError(err.response?.data?.message || err.message || 'An unexpected error occurred');
            setIsRetrying(false);
            throw err;
          }
          // Exponential backoff: 1s, 2s, 4s...
          await new Promise((resolve) => setTimeout(resolve, initialDelay * Math.pow(2, i)));
        }
      }
    },
    [asyncFn, maxRetries, initialDelay]
  );

  return {
    execute,
    error,
    isRetrying,
    attempt,
    resetError: () => setError(null),
  };
};

export default useRetry;
