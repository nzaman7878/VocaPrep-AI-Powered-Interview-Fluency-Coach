import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Spinner from './components/ui/Spinner';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage'));
const InterviewPage = lazy(() => import('./pages/InterviewPage'));
const SessionSummaryPage = lazy(() => import('./pages/SessionSummaryPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

function App() {
  return (
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
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/role-selection" element={<RoleSelectionPage />} />
            <Route path="/interview/:sessionId" element={<InterviewPage />} />
            <Route path="/summary/:sessionId" element={<SessionSummaryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
