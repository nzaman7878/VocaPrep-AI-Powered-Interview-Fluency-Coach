import React, { useEffect } from 'react';
import LoginForm from '../components/auth/LoginForm.jsx';
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearError } from '../store/slices/authSlice';

export default function LoginPage() {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('accessToken');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  if (user || token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden pt-20">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 bg-grain opacity-[0.04] dark:opacity-[0.02] pointer-events-none mix-blend-overlay" />
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-blob" />
      <div className="absolute top-1/2 -right-32 w-[700px] h-[700px] bg-secondary/20 dark:bg-secondary/10 rounded-full blur-[120px] pointer-events-none animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-accent/20 dark:bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-blob animation-delay-4000" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative overflow-hidden mb-6 shadow-inner border border-primary/20">
            <div className="absolute inset-0 bg-waveform-motif opacity-50" />
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5v14M7 5v14M22 10v4M2 10v4" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary">
            Voca<span className="text-primary">Prep</span>
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
