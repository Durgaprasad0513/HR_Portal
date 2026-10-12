# Render release preparation — 12 October 2026

Target: techsupportlohitha/HR_Portal, service srv-db09iqtg1s2s73d5252g.
Live commit observed: 1589915. Release branch: codex/render-production-readiness.

## Confirmed gaps

- Historical deployment logs contain PostgreSQL 22P02: RequisitionStatus lacked CLOSED. Current Neon hr-db production branch has CLOSED and its migration is recorded complete; Render's last two days of logs have no matching 22P02 errors.
- Render logs still show periodic Prisma PostgreSQL connection-closed messages; inspect connection URL pooling and reduce duplicate client pools before release.
- Free compute; no persistent disk, pre-deploy command, SSH/shell, or configured health-check path.
- Auto-deploy is off. Build: npm install && npm run build; start: npm start; root: server/.
- Environment keys present: DATABASE_URL, DIRECT_URL, JWT_SECRET, NODE_ENV, PORT.
- CORS_ORIGIN and SMTP settings absent. Secret values were not revealed.

## Release order

1. Obtain a restorable database backup and staging copy. Inspect enum values, schema and migration history using read-only queries. Rehearse the exact upgrade against that copy. Existing history may differ after schema synchronization; reconcile it before enabling migrations.
2. Storage is deferred per user direction. Production currently has no durable upload disk, and no S3 credentials or bucket have been configured. Do not release attachment changes or restart without a verified file-retention plan. Neon remains the database.
3. Set CORS_ORIGIN=https://hr.pafpl.in and configure mail delivery. Keep JWT_SECRET private and stable.
4. Build with npm ci && npm run build. After staging rehearsal, use npx prisma migrate deploy as the pre-deploy command and /api/ready as the health-check path.
5. Publish a reviewed release PR, wait for CI, merge, deploy its exact commit and verify all four roles and authenticated downloads. Coordinate frontend and backend release.
6. Monitor logs and health. Application rollback does not reverse schema changes; use compatible rollbacks and validated recovery procedures.

## Prepared changes

Authenticated receipt/policy downloads and upload limits; atomic leave approval; UTC leave dates; manager alerts; schema-aware readiness; UPLOAD_DIR support; additive CLOSED enum migration. Production settings, billing and data have not been changed.
