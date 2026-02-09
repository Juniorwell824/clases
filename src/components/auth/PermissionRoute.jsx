// src/components/auth/PermissionRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import usePermissions from '../../hooks/usePermissions';

const PermissionRoute = ({ children, requiredPermissions = [] }) => {
  const { hasAllPermissions, loading } = usePermissions();

  if (loading) {
    return <div>Cargando permisos...</div>;
  }

  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PermissionRoute;