const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const res = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`;
  console.log(res);
}
main().finally(() => prisma.$disconnect());
