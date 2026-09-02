const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const reqs = await prisma.requisition.findMany();
  console.log("REQS:", reqs.length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
