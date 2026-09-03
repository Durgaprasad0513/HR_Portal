import { Role } from '@prisma/client';

export const MODULES = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'employees', label: 'Employee Data Management' },
  { key: 'travel', label: 'Travel Allowance' },
  { key: 'assets', label: 'Asset Management' },
  { key: 'recruitment', label: 'Recruitment Tracker' },
  { key: 'attrition', label: 'Attrition' },
  { key: 'performance', label: 'Performance Review' },
  { key: 'training', label: 'Employee Training' },
  { key: 'requests', label: 'Requests / Queries' },
  { key: 'policies', label: 'HR Policies & Documents' },
  { key: 'departments', label: 'Departments' },
  { key: 'audit', label: 'Audit Log' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'roles', label: 'Role & Access Control' },
  { key: 'settings', label: 'System Settings' },
  { key: 'loginHistory', label: 'Login History' },
] as const;

export type ModuleKey = (typeof MODULES)[number]['key'];
export type PermissionAction = 'view' | 'add' | 'edit' | 'delete' | 'approve' | 'export';

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: 'Super Admin',
  HR: 'HR Admin',
  REMOVED_ROLE: 'REMOVED_ROLE',
  MANAGER: 'Reporting Manager',
  EMPLOYEE: 'Employee',
};

export interface PermissionFlags {
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canViewRestricted: boolean;
  canExport: boolean;
}

const none: PermissionFlags = {
  canView: false,
  canAdd: false,
  canEdit: false,
  canDelete: false,
  canApprove: false,
  canViewRestricted: false,
  canExport: false,
};

const view = (restricted = false): PermissionFlags => ({
  ...none,
  canView: true,
  canViewRestricted: restricted,
  canExport: false,
});

const selfService: PermissionFlags = { ...none, canView: true, canAdd: true, canExport: false };

const ops = (restricted = false): PermissionFlags => ({
  canView: true,
  canAdd: true,
  canEdit: true,
  canDelete: false,
  canApprove: false,
  canViewRestricted: restricted,
  canExport: true,
});

const full: PermissionFlags = {
  canView: true,
  canAdd: true,
  canEdit: true,
  canDelete: true,
  canApprove: true,
  canViewRestricted: true,
  canExport: true,
};

const managerApprove = (restricted = false): PermissionFlags => ({
  canView: true,
  canAdd: false,
  canEdit: false,
  canDelete: false,
  canApprove: true,
  canViewRestricted: restricted,
  canExport: false,
});

export const EMPLOYEE_RESTRICTED_FIELDS = [
  'salary',
  'ctc',
  'basicSalary',
  'grossSalary',
  'bankName',
  'bankAccountNumber',
  'ifscCode',
  'pfNumber',
  'uanNumber',
  'esiNumber',
  'panNumber',
  'aadhaarNumber',
  'statutoryRemarks',
] as const;

export const CANDIDATE_RESTRICTED_FIELDS = [
  'currentSalary',
  'expectedSalary',
  'offeredSalary',
  'recruitmentCost',
] as const;

export const ASSET_RESTRICTED_FIELDS = ['purchaseValue'] as const;

export const PERFORMANCE_RESTRICTED_FIELDS = [
  'selfRating',
  'managerRating',
  'hrRating',
  'finalRating',
  'managerComments',
  'hrComments',
  'strengths',
  'areasOfImprovement',
  'promotionRecommendation',
  'salaryRevisionRecommendation',
  'finalApprovedById',
] as const;

const allFull = Object.fromEntries(MODULES.map((m) => [m.key, full])) as Record<ModuleKey, PermissionFlags>;

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, Record<ModuleKey, PermissionFlags>> = {
  ADMIN: {
    ...allFull,
  },
  HR: {
    ...allFull,
    audit: view(),
    roles: view(),
  },
  REMOVED_ROLE: {
    dashboard: view(),
    employees: ops(false),
    travel: ops(),
    assets: ops(false),
    recruitment: ops(true),
    attrition: view(),
    performance: ops(true),
    training: ops(),
    requests: { ...ops(), canApprove: true },
    policies: ops(),
    departments: view(),
    audit: none,
    notifications: view(),
    roles: none,
    settings: none,
    loginHistory: none,
  },
  MANAGER: {
    dashboard: view(),
    employees: view(),
    travel: managerApprove(),
    assets: view(),
    recruitment: { ...none, canView: true, canAdd: true },
    attrition: view(),
    performance: { ...ops(true), canApprove: true },
    training: { ...none, canView: true, canEdit: true },
    requests: view(),
    policies: view(),
    departments: view(),
    audit: none,
    notifications: view(),
    roles: none,
    settings: none,
    loginHistory: none,
  },
  EMPLOYEE: {
    dashboard: view(),
    employees: view(),
    travel: selfService,
    assets: view(),
    recruitment: none,
    attrition: none,
    performance: { ...none, canView: true, canEdit: true },
    training: { ...none, canView: true, canEdit: true },
    requests: selfService,
    policies: view(),
    departments: view(),
    audit: none,
    notifications: view(),
    roles: none,
    settings: none,
    loginHistory: none,
  },
};

export const ACTION_FLAG: Record<PermissionAction, keyof PermissionFlags> = {
  view: 'canView',
  add: 'canAdd',
  edit: 'canEdit',
  delete: 'canDelete',
  approve: 'canApprove',
  export: 'canExport',
};
