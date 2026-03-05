import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ allowedRoles = [], redirectTo = '/login' }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Add this to see what's happening
  console.log('🔒 ProtectedRoute - State:', { 
    isAuthenticated, 
    loading, 
    user: user?.email,
    userRole: user?.role,
    allowedRoles,
    path: window.location.pathname
  });

  if (loading) {
    return <Loader fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    console.log('🔒 Not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // If no specific roles required, allow any authenticated user
  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Check if user has required role
  if (!user || !allowedRoles.includes(user.role)) {
    console.log('🔒 User lacks required role. Redirecting to home.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;