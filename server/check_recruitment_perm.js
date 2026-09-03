const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const adminRecruitment = await prisma.modulePermission.findFirst({
    where: { role: 'ADMIN', module: 'recruitment' }
  });
  console.log('ADMIN Recruitment:', adminRecruitment);
}
main().finally(() => prisma.$disconnect());
