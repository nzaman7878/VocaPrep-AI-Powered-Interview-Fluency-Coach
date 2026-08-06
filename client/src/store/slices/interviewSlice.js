import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sessionId: null,
  role: null,
  questions: [], // Array of question strings or objects
  currentQuestionIndex: 0,
  // 'idle' | 'recording' | 'processing' | 'completed' | 'error'
  status: 'idle',
  error: null,
  // Active attempt data for the current question
  currentAttempt: {
    audioUrl: null,
    transcript: '',
    words: [],
    feedback: null, // text feedback from AI
    scores: null, // { clarity, relevance, etc }
  },
  // History of completed attempts mapping to question indexes
  attempts: [],
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    /**
     * Initializes a new interview session
     * @param {Object} action.payload - { sessionId, role, questions }
     */
    startInterview: (state, action) => {
      state.sessionId = action.payload.sessionId;
      state.role = action.payload.role;
      state.questions = action.payload.questions || [];
      state.currentQuestionIndex = 0;
      state.status = 'idle';
      state.attempts = [];
      state.error = null;
      state.currentAttempt = { ...initialState.currentAttempt };
    },

    /**
     * Updates the active status of the interview UI
     * @param {string} action.payload - Status string
     */
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    /**
     * Updates partial data for the current question attempt (e.g. after upload or transcription)
     * @param {Object} action.payload - Partial attempt object
     */
    setAttemptData: (state, action) => {
      state.currentAttempt = {
        ...state.currentAttempt,
        ...action.payload,
      };
    },

    /**
     * Marks current question as done, saves attempt, and increments index
     */
    completeQuestion: (state) => {
      // Save current attempt to history array at the exact index
      state.attempts[state.currentQuestionIndex] = { ...state.currentAttempt };

      // Move to next question if available
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.currentAttempt = { ...initialState.currentAttempt };
        state.status = 'idle';
      } else {
        // Entire interview is complete
        state.status = 'completed';
      }
    },

    /**
     * Sets a global error state for the interview view
     */
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'error';
    },

    /**
     * Resets the entire slice to initial state (e.g. when leaving the interview room)
     */
    resetInterview: () => {
      return initialState;
    },
  },
});

export const {
  startInterview,
  setStatus,
  setAttemptData,
  completeQuestion,
  setError,
  resetInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;
