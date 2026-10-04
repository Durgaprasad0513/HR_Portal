import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const now = new Date();
  const c = await prisma.candidate.findMany({
    where: { interviewDate: { gte: now } },
    include: { requisition: { select: { positionTitle: true } }, interviewer: { select: { firstName: true, lastName: true } } }
  });
  console.log(JSON.stringify(c, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
