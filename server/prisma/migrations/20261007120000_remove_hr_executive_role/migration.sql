-- Remove the retired REMOVED_ROLE role. Preserve access for any accounts
-- that still use it by converting them to HR, then discard its matrix rows.
UPDATE "users"
SET "role" = 'HR'
WHERE "role" = 'REMOVED_ROLE';

DELETE FROM "module_permissions"
WHERE "role" = 'REMOVED_ROLE';

CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE');

ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "users"
  ALTER COLUMN "role" TYPE "Role_new"
  USING ("role"::text::"Role_new");

ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'EMPLOYEE'::"Role_new";

ALTER TABLE "module_permissions"
  ALTER COLUMN "role" TYPE "Role_new"
  USING ("role"::text::"Role_new");

DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";
