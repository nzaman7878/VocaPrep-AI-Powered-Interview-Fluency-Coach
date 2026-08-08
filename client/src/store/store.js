import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import interviewReducer from './slices/interviewSlice.js';
import progressReducer from './slices/progressSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interview: interviewReducer,
    progress: progressReducer,
  },
});

export default store;
