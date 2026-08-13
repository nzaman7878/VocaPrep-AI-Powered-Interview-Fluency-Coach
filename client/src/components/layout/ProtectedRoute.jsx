import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../ui/Spinner';

const ProtectedRoute = ({ children }) => {
  const { user, status } = useSelector((state) => state.auth);
  const location = useLocation();
  const token = localStorage.getItem('accessToken');

  // If there's a token but we're currently fetching the profile, show loading
  if (token && status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  // If no token and no user, user is definitively unauthenticated
  if (!user && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we have a user but they are an admin, they shouldn't access standard user routes
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // If we have a user (or token exists but wasn't cleared by failed fetch), render children
  return children;
};

export default ProtectedRoute;
