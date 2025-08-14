import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';
import { ROUTES } from './constants';

// Protected route for authenticated users
export const ProtectedRoute = () => {
  const isAuthenticated = authService.isAuthenticated();
  
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} />;
};

// Protected route for admin users
export const AdminRoute = () => {
  const isAdmin = authService.isAdmin();
  
  return isAdmin ? <Outlet /> : <Navigate to={ROUTES.HOME} />;
};