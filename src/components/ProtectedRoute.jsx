import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/auth';

const ProtectedRoute = ({ children, role }) => {
  const token = useAuth((s) => s.token);
  const user = useAuth((s) => s.user);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default ProtectedRoute;
