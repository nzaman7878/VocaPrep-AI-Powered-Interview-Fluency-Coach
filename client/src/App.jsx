import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, logout } from './store/slices/authSlice';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Spinner from './components/ui/Spinner';
import ProtectedRoute from './components/layout/ProtectedRoute';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage'));
const InterviewPage = lazy(() => import('./pages/InterviewPage'));
const SessionSummaryPage = lazy(() => import('./pages/SessionSummaryPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

import { ThemeProvider } from './context/ThemeContext';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(fetchProfile())
        .unwrap()
        .catch(() => {
          // If profile fetch fails (e.g. invalid token), logout to clear state
          dispatch(logout());
        });
    }
  }, [dispatch, user]);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <Suspense
            fallback={
              <div className="flex h-screen w-full items-center justify-center bg-background">
                <Spinner size="lg" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Navigate to="/login" replace />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />

              {/* Protected Routes */}
              <Route
                path="/role-selection"
                element={
                  <ProtectedRoute>
                    <RoleSelectionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interview/:sessionId"
                element={
                  <ProtectedRoute>
                    <InterviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/summary/:sessionId"
                element={
                  <ProtectedRoute>
                    <SessionSummaryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Error Pages */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
