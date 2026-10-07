
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types';
import type { ModuleKey } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
 allowedRoles?: Role[];
 requiredModule?: ModuleKey;
 requiredAction?: 'canAdd' | 'canEdit' | 'canDelete' | 'canApprove' | 'canExport';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, requiredModule, requiredAction }) => {
 const { user, token, isLoading } = useAuth();
 const { permissions, isLoading: permissionsLoading } = usePermissions();

 if (isLoading) {
 return <div className="h-screen w-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;
 }

 if (!token || !user) {
 return <Navigate to="/login" replace />;
 }

 if (allowedRoles && !allowedRoles.includes(user.role)) {
 return <Navigate to="/dashboard" replace />;
 }

 if (requiredModule && permissionsLoading) {
 return <div className="h-screen w-screen flex items-center justify-center bg-surface"><LoadingSpinner /></div>;
 }

 if (requiredModule && permissions?.[requiredModule]?.canView !== true) {
 return <Navigate to="/dashboard" replace />;
 }

 if (requiredModule && requiredAction && permissions?.[requiredModule]?.[requiredAction] !== true) {
 return <Navigate to="/dashboard" replace />;
 }

 return <Outlet />;
};


