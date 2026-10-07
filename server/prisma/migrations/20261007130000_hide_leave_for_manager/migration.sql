UPDATE "module_permissions"
SET
  "canView" = false,
  "canAdd" = false,
  "canEdit" = false,
  "canDelete" = false,
  "canApprove" = false,
  "canViewRestricted" = false,
  "canExport" = false,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "role" = 'MANAGER'
  AND "module" IN ('leave', 'roles');
