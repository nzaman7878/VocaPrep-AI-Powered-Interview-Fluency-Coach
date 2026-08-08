import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreSession, startInterview } from '../store/slices/interviewSlice';
import { sessionApi } from '../api/sessionApi';

const STORAGE_KEY = 'vocaprep_active_session';

/**
 * Custom hook to manage saving and restoring interview session state
 * to localStorage, allowing users to refresh the page without losing their place.
 */
const useSessionPersistence = (sessionId) => {
  const dispatch = useDispatch();
  const interviewState = useSelector((state) => state.interview);
  const [isRestoring, setIsRestoring] = useState(true);
  const [error, setError] = useState(null);

  // 1. Initialize session (from localStorage or API)
  useEffect(() => {
    const initializeSession = async () => {
      if (!sessionId) {
        setIsRestoring(false);
        return;
      }

      setIsRestoring(true);
      setError(null);

      try {
        // Attempt to restore from local storage first
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Only restore if it matches the current URL sessionId and wasn't completed
          if (parsed.sessionId === sessionId && parsed.status !== 'completed') {
            dispatch(restoreSession(parsed));
            setIsRestoring(false);
            return;
          }
        }

        // If no valid local storage, or ID mismatch, fetch from API
        if (interviewState.sessionId !== sessionId) {
          const response = await sessionApi.getSession(sessionId);
          dispatch(
            startInterview({
              sessionId: response.data._id,
              role: response.data.role,
              questions: response.data.questions || [],
            })
          );
        }
      } catch (err) {
        console.error('Failed to initialize session:', err);
        setError(err);
      } finally {
        setIsRestoring(false);
      }
    };

    initializeSession();
  }, [sessionId, dispatch]);
  // Omit interviewState.sessionId from deps to prevent loop during restore

  // 2. Sync active session state to localStorage on changes
  useEffect(() => {
    if (!interviewState.sessionId || interviewState.sessionId !== sessionId) return;

    try {
      if (interviewState.status === 'completed') {
        // Clear storage when the interview is fully completed
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(interviewState));
      }
    } catch (err) {
      console.error('Failed to save session to localStorage', err);
    }
  }, [interviewState, sessionId]);

  return { isRestoring, error };
};

export default useSessionPersistence;
