import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Overall aggregated metrics for the user
  totalSessions: 0,
  averageScore: 0,
  totalPracticeTimeSeconds: 0,

  // Historical data for charting
  history: [], // Array of snapshot objects: { date, contentScore, clarityScore, ... }

  // Loading and error states
  isLoading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    /**
     * Marks the progress data as currently loading
     */
    setProgressLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    /**
     * Sets the complete progress data payload
     * @param {Object} action.payload - { totalSessions, averageScore, totalPracticeTimeSeconds, history }
     */
    setProgressData: (state, action) => {
      state.isLoading = false;
      state.totalSessions = action.payload.totalSessions || 0;
      state.averageScore = action.payload.averageScore || 0;
      state.totalPracticeTimeSeconds = action.payload.totalPracticeTimeSeconds || 0;
      state.history = action.payload.history || [];
      state.error = null;
    },

    /**
     * Sets an error state if fetching progress fails
     */
    setProgressError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    /**
     * Resets the progress data to initial state (e.g. on logout)
     */
    resetProgress: () => {
      return initialState;
    },
  },
});

export const { setProgressLoading, setProgressData, setProgressError, resetProgress } =
  progressSlice.actions;

export default progressSlice.reducer;
