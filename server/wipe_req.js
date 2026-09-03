const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "candidates" CASCADE;`);
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "requisitions" CASCADE;`);
  console.log("Truncated requisitions and candidates");
}
main().finally(() => prisma.$disconnect());
