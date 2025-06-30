import React from 'react';
import { useApp } from '../../context/AppContext';

interface PermissionGateProps {
  permission?: string;
  role?: 'admin' | 'member' | 'viewer';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  role,
  children,
  fallback = null
}) => {
  const { hasPermission, currentUser } = useApp();

  // Check role-based access
  if (role && currentUser?.role !== role) {
    return <>{fallback}</>;
  }

  // Check permission-based access
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGate;