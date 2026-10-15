-- Keep candidates in the first interview stage after removing screening from recruitment.
UPDATE "candidates"
SET "selectionStatus" = 'SELECTION_REJECTED'
WHERE "screeningStatus" = 'SCREENING_REJECTED'
  AND "selectionStatus" IS NULL;

UPDATE "candidates"
SET "currentStage" = 'TELEPHONIC'
WHERE "currentStage" = 'SCREENING';

UPDATE "candidates"
SET "screeningStatus" = 'SHORTLISTED'
WHERE "screeningStatus" IN ('SCREENING_PENDING', 'SCREENING_REJECTED');

ALTER TABLE "candidates" ALTER COLUMN "currentStage" SET DEFAULT 'TELEPHONIC';
ALTER TABLE "candidates" ALTER COLUMN "screeningStatus" SET DEFAULT 'SHORTLISTED';

-- Requisitions in the removed stage continue at the first interview stage.
UPDATE "requisitions" SET "status" = 'TELEPHONIC' WHERE "status" = 'SCREENING';
ALTER TABLE "requisitions" ALTER COLUMN "status" DROP DEFAULT;

ALTER TYPE "RequisitionStatus" RENAME TO "RequisitionStatus_old";
CREATE TYPE "RequisitionStatus" AS ENUM (
  'REQUIREMENT', 'SOURCING', 'TELEPHONIC', 'HR_INTERVIEW', 'TECHNICAL',
  'MANAGEMENT', 'SELECTED', 'OFFER', 'JOINED_REJECTED', 'CLOSED'
);
ALTER TABLE "requisitions"
  ALTER COLUMN "status" TYPE "RequisitionStatus"
  USING ("status"::text::"RequisitionStatus");
DROP TYPE "RequisitionStatus_old";
ALTER TABLE "requisitions" ALTER COLUMN "status" SET DEFAULT 'REQUIREMENT';