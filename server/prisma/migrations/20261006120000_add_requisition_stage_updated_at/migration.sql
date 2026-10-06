ALTER TABLE "requisitions"
ADD COLUMN "stageUpdatedAt" TIMESTAMP(3);

UPDATE "requisitions"
SET "stageUpdatedAt" = "updatedAt";

ALTER TABLE "requisitions"
ALTER COLUMN "stageUpdatedAt" SET NOT NULL,
ALTER COLUMN "stageUpdatedAt" SET DEFAULT CURRENT_TIMESTAMP;
