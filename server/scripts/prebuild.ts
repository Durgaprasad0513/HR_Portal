import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

async function run() {
  // Only run this script if DATABASE_URL is present, which is true in Render
  if (process.env.DATABASE_URL) {
    console.log('Running pre-build data cleanup for HR_EXECUTIVE role...');
    const sql = `
      UPDATE "users" SET "role" = 'HR' WHERE "role" = 'HR_EXECUTIVE';
      DELETE FROM "module_permissions" WHERE "role" = 'HR_EXECUTIVE';
      DROP TABLE IF EXISTS "_prisma_migrations";
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

    try {
      // Delete the migrations folder so 'migrate deploy' becomes a no-op
      // This prevents conflicts between 'db push' (which runs in build) and 'migrate deploy' (which runs in start)
      const migrationsPath = path.join(__dirname, '../prisma/migrations');
      if (fs.existsSync(migrationsPath)) {
        fs.rmSync(migrationsPath, { recursive: true, force: true });
        console.log('Deleted prisma/migrations directory to bypass migrate deploy.');
      }
    } catch (e) {
      console.log('Failed to delete migrations directory:', e);
    }
  } else {
    console.log('DATABASE_URL not found, skipping pre-build cleanup.');
  }
}

run();
