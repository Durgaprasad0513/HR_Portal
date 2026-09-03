const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@hrms.com' }
  });
  console.log(admin);
}
main().finally(() => prisma.$disconnect());
