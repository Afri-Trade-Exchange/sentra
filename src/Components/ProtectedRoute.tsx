import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { UserRole } from '../firebase/authService';

const ROLE_HOME: Record<UserRole, string> = {
  trader: '/dashboard',
  customs: '/customs-dashboard',
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: UserRole }> = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // A signed-in user whose role doesn't match this route (e.g. a trader
  // hitting /customs-dashboard directly) gets sent to their own dashboard
  // instead of the mismatched UI — Firestore rules already deny the data,
  // this just avoids showing them a shell that can't do anything.
  if (requiredRole && role && role !== requiredRole) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
