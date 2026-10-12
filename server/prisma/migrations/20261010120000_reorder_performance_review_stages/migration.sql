-- Self-review now flows to HR before Manager review. Move reviews waiting at
-- the old manager-first step to the new next step, HR review.
UPDATE "performance_reviews"
SET "status" = 'HR_REVIEW'
WHERE "status" = 'MANAGER_REVIEW';
