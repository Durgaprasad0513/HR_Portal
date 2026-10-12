-- Existing deployments may already have this column from a schema sync.
-- Create it before the following permission data migrations reference it.
ALTER TABLE "module_permissions" ADD COLUMN IF NOT EXISTS "canExport" BOOLEAN NOT NULL DEFAULT false;
