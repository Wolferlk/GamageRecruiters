import React from 'react';
import { Navigate } from 'react-router-dom';
import verifyToken from '../scripts/verifyToken';

const ProtectedRoute = ({ children }) => {
  const isLoginAuthenticated = localStorage.getItem('IsLoginAuthenticated');
  console.log('Is User Authenticated:', isLoginAuthenticated);
  // return isAuthenticated ? children : <Navigate to="/login" />;
  if (isLoginAuthenticated == true) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ProtectedRoute;
