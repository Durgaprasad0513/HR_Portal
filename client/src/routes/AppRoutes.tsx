import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';

// Auth
import LoginPage from '@/pages/auth/LoginPage';

// Dashboard
import DashboardPage from '@/pages/dashboard/DashboardPage';

// Employees
import EmployeeListPage from '@/pages/employees/EmployeeListPage';
import EmployeeFormPage from '@/pages/employees/EmployeeFormPage';
import EmployeeDetailPage from '@/pages/employees/EmployeeDetailPage';

// Departments
import DepartmentListPage from '@/pages/departments/DepartmentListPage';
import DepartmentFormPage from '@/pages/departments/DepartmentFormPage';

// Modules
import PerformanceListPage from '@/pages/performance/PerformanceListPage';
import TrainingListPage from '@/pages/training/TrainingListPage';
import RequestListPage from '@/pages/requests/RequestListPage';
import PolicyListPage from '@/pages/policies/PolicyListPage';
import AssetListPage from '@/pages/assets/AssetListPage';
import TravelListPage from '@/pages/travel/TravelListPage';
import OfficeExpensesPage from '@/pages/expenses/OfficeExpensesPage';
import RecruitmentPage from '@/pages/recruitment/RecruitmentPage';
import NotificationListPage from '@/pages/notifications/NotificationListPage';
import AttritionDashboardPage from '@/pages/attrition/AttritionDashboardPage';
import SettingsPage from '@/pages/settings/SettingsPage';
import AuditLogPage from '@/pages/audit/AuditLogPage';
import LoginHistoryPage from '@/pages/loginHistory/LoginHistoryPage';
import RoleManagementPage from '@/pages/roles/RoleManagementPage';
import NotFoundPage from '@/pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/new" element={<EmployeeFormPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
          
          <Route path="/performance" element={<PerformanceListPage />} />
          <Route path="/documents" element={<PolicyListPage />} />
          <Route path="/assets" element={<AssetListPage />} />
          <Route path="/travel" element={<TravelListPage />} />
          <Route path="/office-expenses" element={<OfficeExpensesPage />} />
          <Route path="/recruitment" element={<RecruitmentPage />} />
          
          <Route path="/departments" element={<DepartmentListPage />} />
          <Route path="/departments/new" element={<DepartmentFormPage />} />
          <Route path="/departments/:id/edit" element={<DepartmentFormPage />} />
          
          <Route path="/training" element={<TrainingListPage />} />
          <Route path="/requests" element={<RequestListPage />} />
          <Route path="/policies" element={<Navigate to="/documents" replace />} />
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
          <Route path="/notifications" element={<NotificationListPage />} />

          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'HR']} />}>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/audit" element={<AuditLogPage />} />
            <Route path="/login-history" element={<LoginHistoryPage />} />
            <Route path="/roles" element={<RoleManagementPage />} />
            <Route path="/attrition" element={<AttritionDashboardPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
