ALTER TABLE "candidates" ADD COLUMN "currentStage" TEXT NOT NULL DEFAULT 'SCREENING', ADD COLUMN "stageEnteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- Existing records have no reliable stage-entry timestamp. This migration time is
-- the start of tracking; do not invent past stage changes or entry timestamps.
UPDATE "candidates" SET "currentStage" = CASE
 WHEN "joiningStatus" = 'JOINED' AND "actualJoiningDate" IS NOT NULL AND "offerStatus" = 'OFFER_ACCEPTED' THEN 'JOINED'
 WHEN "offerStatus" IN ('RELEASED', 'OFFER_ACCEPTED', 'OFFER_DECLINED') THEN 'OFFER'
 WHEN UPPER(REGEXP_REPLACE(TRIM(COALESCE("interviewRound", '')), '[[:space:]-]+', '_', 'g')) IN ('TELEPHONIC', 'TELEPHONIC_INTERVIEW') THEN 'TELEPHONIC'
 WHEN UPPER(REGEXP_REPLACE(TRIM(COALESCE("interviewRound", '')), '[[:space:]-]+', '_', 'g')) = 'HR_INTERVIEW' THEN 'HR_INTERVIEW'
 WHEN UPPER(REGEXP_REPLACE(TRIM(COALESCE("interviewRound", '')), '[[:space:]-]+', '_', 'g')) IN ('TECHNICAL', 'TECHNICAL_INTERVIEW') THEN 'TECHNICAL'
 WHEN UPPER(REGEXP_REPLACE(TRIM(COALESCE("interviewRound", '')), '[[:space:]-]+', '_', 'g')) IN ('MANAGEMENT', 'MANAGEMENT_INTERVIEW') THEN 'MANAGEMENT'
 WHEN UPPER(REGEXP_REPLACE(TRIM(COALESCE("interviewRound", '')), '[[:space:]-]+', '_', 'g')) = 'OFFER' THEN 'OFFER'
 ELSE 'SCREENING' END;
CREATE INDEX "candidates_currentStage_stageEnteredAt_idx" ON "candidates"("currentStage", "stageEnteredAt");
CREATE TABLE "candidate_stage_history" (
 "id" TEXT NOT NULL PRIMARY KEY,
 "candidateId" TEXT NOT NULL,
 "fromStage" TEXT NOT NULL,
 "toStage" TEXT NOT NULL,
 "actorId" TEXT NOT NULL,
 "reason" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "candidate_stage_history_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "candidate_stage_history_candidateId_createdAt_idx" ON "candidate_stage_history"("candidateId", "createdAt");
