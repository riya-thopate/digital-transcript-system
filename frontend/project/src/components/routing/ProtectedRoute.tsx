import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
import { LoadingState } from '@/components/ui/LoadingState';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState fullScreen />;
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}

export function RoleRoute({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState fullScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!roles.includes(user.role))
    return <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  return <>{children}</>;
}

export function StudentRoute({ children }: { children: ReactNode }) {
  return <RoleRoute roles={['STUDENT']}>{children}</RoleRoute>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  return <RoleRoute roles={['ADMIN']}>{children}</RoleRoute>;
}
