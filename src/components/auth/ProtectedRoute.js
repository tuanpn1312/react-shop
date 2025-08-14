import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import { ROUTES } from '../../utils/constants';

const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;