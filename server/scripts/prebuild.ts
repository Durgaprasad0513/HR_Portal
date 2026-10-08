import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

async function run() {
  // Only run this script if DATABASE_URL is present, which is true in Render
  if (process.env.DATABASE_URL) {
    console.log('Running pre-build data cleanup for REMOVED_ROLE role...');
    const sql = `
      UPDATE "users" SET "role" = 'HR' WHERE "role" = 'REMOVED_ROLE';
      DELETE FROM "module_permissions" WHERE "role" = 'REMOVED_ROLE';
    `;
    
    try {
      // Execute the raw SQL using prisma db execute
      execSync('npx prisma db execute --schema prisma/schema.prisma --stdin', {
        input: sql,
        stdio: ['pipe', 'inherit', 'inherit']
      });
      console.log('Pre-build cleanup finished successfully.');
    } catch (e) {
      console.log('Pre-build cleanup failed or already applied. Continuing build...', e);
    }
  } else {
    console.log('DATABASE_URL not found, skipping pre-build cleanup.');
  }
}

run();
