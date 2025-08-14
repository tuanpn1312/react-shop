import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import { ROUTES } from '../../utils/constants';

const AdminRoute = () => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    // Redirect to home page if user is not an admin
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // If authenticated and admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;