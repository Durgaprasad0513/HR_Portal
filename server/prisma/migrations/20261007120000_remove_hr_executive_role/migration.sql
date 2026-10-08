-- Remove the retired HR_EXECUTIVE role. Preserve access for any accounts
-- that still use it by converting them to HR, then discard its matrix rows.
UPDATE "users"
SET "role" = 'HR'
WHERE "role" = 'HR_EXECUTIVE';

DELETE FROM "module_permissions"
WHERE "role" = 'HR_EXECUTIVE';

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
