const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`UPDATE "requisitions" SET status = 'REQUIREMENT' WHERE status = 'OPEN'`);
  await prisma.$executeRawUnsafe(`UPDATE "requisitions" SET status = 'REQUIREMENT' WHERE status = 'IN_PROGRESS'`);
  await prisma.$executeRawUnsafe(`UPDATE "requisitions" SET status = 'REQUIREMENT' WHERE status = 'CLOSED'`);
  await prisma.$executeRawUnsafe(`UPDATE "requisitions" SET status = 'REQUIREMENT' WHERE status = 'ON_HOLD'`);
  console.log("Updated statuses");
}
main().finally(() => prisma.$disconnect());
