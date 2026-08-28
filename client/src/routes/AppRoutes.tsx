import React from 'react';
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

// Time Tracking (Attendance)
import AttendancePage from '@/pages/attendance/AttendancePage';

// New Visily Pages
import TaskListPage from '@/pages/tasks/TaskListPage';
import NewsPage from '@/pages/news/NewsPage';

// Leaves
import LeaveApplicationPage from '@/pages/leave/LeaveApplicationPage';
import LeaveHistoryPage from '@/pages/leave/LeaveHistoryPage';
import LeaveApprovalsPage from '@/pages/leave/LeaveApprovalsPage';

// Modules
import TravelListPage from '@/pages/travel/TravelListPage';
import AssetListPage from '@/pages/assets/AssetListPage';
import RecruitmentPage from '@/pages/recruitment/RecruitmentPage';
import PerformanceListPage from '@/pages/performance/PerformanceListPage';
import TrainingListPage from '@/pages/training/TrainingListPage';
import RequestListPage from '@/pages/requests/RequestListPage';
import PolicyListPage from '@/pages/policies/PolicyListPage'; // Now acting as Documents
import NotificationListPage from '@/pages/notifications/NotificationListPage';

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
          
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/performance" element={<PerformanceListPage />} />
          <Route path="/documents" element={<PolicyListPage />} />
          <Route path="/news" element={<NewsPage />} />
          
          {/* Legacy/Other Routes */}
          <Route path="/departments" element={<DepartmentListPage />} />
          <Route path="/departments/new" element={<DepartmentFormPage />} />
          <Route path="/departments/:id/edit" element={<DepartmentFormPage />} />
          <Route path="/leaves/apply" element={<LeaveApplicationPage />} />
          <Route path="/leaves/history" element={<LeaveHistoryPage />} />
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER']} />}>
            <Route path="/leaves/approvals" element={<LeaveApprovalsPage />} />
          </Route>
          <Route path="/travel" element={<TravelListPage />} />
          <Route path="/assets" element={<AssetListPage />} />
          <Route path="/training" element={<TrainingListPage />} />
          <Route path="/requests" element={<RequestListPage />} />
          <Route path="/policies" element={<Navigate to="/documents" replace />} />
          <Route path="/notifications" element={<NotificationListPage />} />

          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'HR']} />}>
            <Route path="/recruitment" element={<RecruitmentPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
