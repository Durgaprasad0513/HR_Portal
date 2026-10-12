-- Backfill schema changes previously introduced only through local db push.
-- IF NOT EXISTS preserves databases where those changes already exist.
ALTER TABLE "candidates" ADD COLUMN IF NOT EXISTS "interviewLocation" TEXT;
ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "bloodGroup" TEXT,
ADD COLUMN IF NOT EXISTS "experience" TEXT, ADD COLUMN IF NOT EXISTS "qualification" TEXT;
ALTER TABLE "leaves" ADD COLUMN IF NOT EXISTS "hourlyDuration" INTEGER,
ADD COLUMN IF NOT EXISTS "isHalfDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "isHourly" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "performance_reviews" ADD COLUMN IF NOT EXISTS "status" "ReviewStatus" NOT NULL DEFAULT 'EMPLOYEE_REVIEW';
ALTER TABLE "training_participants" ADD COLUMN IF NOT EXISTS "trainerFeedbackComments" TEXT,
ADD COLUMN IF NOT EXISTS "trainerFeedbackRating" DECIMAL(65,30);
ALTER TABLE "trainings" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS "trainingEndDate" DATE;
ALTER TABLE "requisitions" ALTER COLUMN "status" SET DEFAULT 'REQUIREMENT';

CREATE TABLE IF NOT EXISTS "OfficeExpense" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "expenseDate" DATE NOT NULL,
  "category" "ExpenseCategory" NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "billUpload" TEXT,
  "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
  "submittedById" TEXT NOT NULL,
  "approvedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OfficeExpense_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OfficeExpense_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
