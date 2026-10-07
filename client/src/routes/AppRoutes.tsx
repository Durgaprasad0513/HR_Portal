import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Auth
import LoginPage from '@/pages/auth/LoginPage';

// Authenticated pages load on demand so the login shell and first route stay small.
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const EmployeeListPage = lazy(() => import('@/pages/employees/EmployeeListPage'));
const EmployeeFormPage = lazy(() => import('@/pages/employees/EmployeeFormPage'));
const EmployeeDetailPage = lazy(() => import('@/pages/employees/EmployeeDetailPage'));
const DepartmentListPage = lazy(() => import('@/pages/departments/DepartmentListPage'));
const DepartmentFormPage = lazy(() => import('@/pages/departments/DepartmentFormPage'));
const PerformanceListPage = lazy(() => import('@/pages/performance/PerformanceListPage'));
const TrainingListPage = lazy(() => import('@/pages/training/TrainingListPage'));
const RequestListPage = lazy(() => import('@/pages/requests/RequestListPage'));
const PolicyListPage = lazy(() => import('@/pages/policies/PolicyListPage'));
const AssetListPage = lazy(() => import('@/pages/assets/AssetListPage'));
const TravelListPage = lazy(() => import('@/pages/travel/TravelListPage'));
const OfficeExpensesPage = lazy(() => import('@/pages/expenses/OfficeExpensesPage'));
const RecruitmentPage = lazy(() => import('@/pages/recruitment/RecruitmentPage'));
const InterviewCalendarPage = lazy(() => import('@/pages/recruitment/InterviewCalendarPage'));
const NotificationListPage = lazy(() => import('@/pages/notifications/NotificationListPage'));
const AttritionDashboardPage = lazy(() => import('@/pages/attrition/AttritionDashboardPage'));
const AuditLogPage = lazy(() => import('@/pages/audit/AuditLogPage'));
const LoginHistoryPage = lazy(() => import('@/pages/loginHistory/LoginHistoryPage'));
const RoleManagementPage = lazy(() => import('@/pages/roles/RoleManagementPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const DesignSystemPage = lazy(() => import('@/pages/design/DesignSystemPage'));

const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Leaves
const LeaveApplicationPage = lazy(() => import('@/pages/leave/LeaveApplicationPage'));

const LeaveApprovalsPage = lazy(() => import('@/pages/leave/LeaveApprovalsPage'));

const AppRoutes = () => {
 return (
 <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-surface"><LoadingSpinner /></div>}>
 <Routes>
 <Route path="/login" element={<LoginPage />} />
 
 <Route element={<ProtectedRoute />}>
 <Route element={<MainLayout />}>
 <Route path="/" element={<Navigate to="/dashboard" replace />} />
 <Route element={<ProtectedRoute requiredModule="dashboard" />}>
 <Route path="/dashboard" element={<DashboardPage />} />
 </Route>
 
 <Route element={<ProtectedRoute requiredModule="employees" />}>
 <Route path="/employees" element={<EmployeeListPage />} />
 <Route path="/employees/:id" element={<EmployeeDetailPage />} />
 <Route element={<ProtectedRoute requiredModule="employees" requiredAction="canAdd" />}><Route path="/employees/new" element={<EmployeeFormPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="employees" requiredAction="canEdit" />}><Route path="/employees/:id/edit" element={<EmployeeFormPage />} /></Route>
 </Route>
 
 <Route element={<ProtectedRoute requiredModule="performance" />}><Route path="/performance" element={<PerformanceListPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="policies" />}><Route path="/documents" element={<PolicyListPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="assets" />}><Route path="/assets" element={<AssetListPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="travel" />}><Route path="/travel" element={<TravelListPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="expenses" />}><Route path="/office-expenses" element={<OfficeExpensesPage />} /></Route>
 
 <Route element={<ProtectedRoute requiredModule="departments" />}>
 <Route path="/departments" element={<DepartmentListPage />} />
 <Route element={<ProtectedRoute requiredModule="departments" requiredAction="canAdd" />}><Route path="/departments/new" element={<DepartmentFormPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="departments" requiredAction="canEdit" />}><Route path="/departments/:id/edit" element={<DepartmentFormPage />} /></Route>
 </Route>
 
 <Route element={<ProtectedRoute requiredModule="training" />}><Route path="/training" element={<TrainingListPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="requests" />}><Route path="/requests" element={<RequestListPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="leave" requiredAction="canAdd" />}><Route path="/leaves" element={<LeaveApplicationPage />} /></Route>

 <Route path="/policies" element={<Navigate to="/documents" replace />} />
 <Route path="/profile" element={<Navigate to="/" replace />} />
 <Route element={<ProtectedRoute requiredModule="notifications" />}><Route path="/notifications" element={<NotificationListPage />} /></Route>

 <Route element={<ProtectedRoute requiredModule="recruitment" />}>
 <Route path="/recruitment" element={<RecruitmentPage />} />
 <Route path="/recruitment/interviews" element={<InterviewCalendarPage />} />
 </Route>
 <Route element={<ProtectedRoute requiredModule="leave" />}><Route path="/leaves/approvals" element={<LeaveApprovalsPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="audit" />}><Route path="/audit" element={<AuditLogPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="loginHistory" />}><Route path="/login-history" element={<LoginHistoryPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="roles" />}><Route path="/roles" element={<RoleManagementPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="settings" />}><Route path="/settings" element={<SettingsPage />} /></Route>
 <Route element={<ProtectedRoute requiredModule="attrition" />}><Route path="/dashboard/attrition" element={<AttritionDashboardPage />} /></Route>
 <Route path="/attrition" element={<Navigate to="/dashboard/attrition" replace />} />

 <Route path="*" element={<NotFoundPage />} />
 </Route>
 </Route>
 </Routes>
 </Suspense>
 );
};

export default AppRoutes;



