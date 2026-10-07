INSERT INTO "departments" ("id", "name", "description", "headId", "createdAt", "updatedAt")
SELECT
  md5('hr-portal-department:' || department_name),
  department_name,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM (VALUES
  ('CIVIL'),
  ('COUNTER'),
  ('ELECTRICAL'),
  ('ETP PLANT'),
  ('FEED'),
  ('INSTRUMENTATION'),
  ('MARKETING'),
  ('MECHANICAL'),
  ('POWER PLANT'),
  ('PRODUCTION'),
  ('PURCHASE & STORES'),
  ('QUALITY LAB'),
  ('SECURITY')
) AS requested_departments(department_name)
ON CONFLICT ("name") DO NOTHING;
