UPDATE "module_permissions"
SET "canView" = true, "updatedAt" = CURRENT_TIMESTAMP
WHERE "role" = 'EMPLOYEE' AND "module" = 'settings';
