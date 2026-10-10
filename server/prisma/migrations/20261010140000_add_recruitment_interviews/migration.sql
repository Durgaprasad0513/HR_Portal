CREATE TYPE "InterviewAppointmentStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
CREATE TYPE "InterviewMode" AS ENUM ('IN_PERSON', 'VIDEO', 'PHONE');

CREATE TABLE "recruitment_interviews" (
  "id" TEXT NOT NULL,
  "candidateId" TEXT NOT NULL,
  "round" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  "mode" "InterviewMode" NOT NULL DEFAULT 'IN_PERSON',
  "location" TEXT,
  "status" "InterviewAppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
  "feedback" TEXT,
  "score" INTEGER,
  "recommendation" TEXT,
  "interviewerId" TEXT,
  "createdById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "recruitment_interviews_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "recruitment_interviews_startsAt_status_idx" ON "recruitment_interviews"("startsAt", "status");
CREATE INDEX "recruitment_interviews_candidateId_round_startsAt_idx" ON "recruitment_interviews"("candidateId", "round", "startsAt");
CREATE INDEX "recruitment_interviews_interviewerId_startsAt_idx" ON "recruitment_interviews"("interviewerId", "startsAt");

ALTER TABLE "recruitment_interviews" ADD CONSTRAINT "recruitment_interviews_candidateId_fkey"
  FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "recruitment_interviews" ADD CONSTRAINT "recruitment_interviews_interviewerId_fkey"
  FOREIGN KEY ("interviewerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Carry forward the currently scheduled/legacy round without inventing earlier stages.
INSERT INTO "recruitment_interviews" (
  "id", "candidateId", "round", "startsAt", "endsAt", "timezone", "mode", "location", "status",
  "feedback", "score", "interviewerId", "createdAt", "updatedAt"
)
SELECT
  'legacy_interview_' || c."id", c."id", COALESCE(NULLIF(c."interviewRound", ''), 'TELEPHONIC'),
  c."interviewDate", c."interviewDate" + INTERVAL '1 hour', 'Asia/Kolkata', 'IN_PERSON', c."interviewLocation",
  CASE WHEN c."interviewFeedback" = 'Finished' THEN 'COMPLETED'::"InterviewAppointmentStatus" ELSE 'SCHEDULED'::"InterviewAppointmentStatus" END,
  CASE WHEN c."interviewFeedback" IN ('Finished', 'Pending') THEN NULL ELSE c."interviewFeedback" END,
  c."interviewScore", c."interviewerId", c."createdAt", CURRENT_TIMESTAMP
FROM "candidates" c
WHERE c."interviewDate" IS NOT NULL;

ALTER TABLE "requisitions" ADD COLUMN "closureSource" TEXT, ADD COLUMN "closureReason" TEXT;
ALTER TABLE "candidates" ADD COLUMN "joiningStatus" TEXT NOT NULL DEFAULT 'PENDING', ADD COLUMN "actualJoiningDate" TIMESTAMP(3);
-- Existing terminal records default to manual closure; future automatic closures are explicit.
UPDATE "requisitions" SET "closureSource" = 'MANUAL' WHERE "status" IN ('CLOSED', 'JOINED_REJECTED');
UPDATE "requisitions" r SET "closureSource" = 'AUTO_FILLED'
WHERE r."status" = 'CLOSED' AND (SELECT a."actionPerformed" FROM "audit_logs" a WHERE a."moduleAffected" = 'recruitment'
AND a."recordIdAffected" = r."id" AND a."actionPerformed" IN ('CLOSE_FILLED_REQUISITION', 'UPDATE_REQUISITION_STATUS') ORDER BY a."createdAt" DESC LIMIT 1) = 'CLOSE_FILLED_REQUISITION';

ALTER TABLE "recruitment_interviews" ADD COLUMN "draftFeedback" TEXT, ADD COLUMN "draftScore" INTEGER,
ADD COLUMN "draftRecommendation" TEXT, ADD COLUMN "feedbackSubmittedAt" TIMESTAMP(3), ADD COLUMN "feedbackSubmittedById" TEXT;
