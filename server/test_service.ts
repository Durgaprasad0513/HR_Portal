import { PrismaClient } from '@prisma/client';
import { recruitmentService } from './src/modules/recruitment/recruitment.service';

const prisma = new PrismaClient();

async function test() {
  const user = await prisma.user.findFirst();
  console.log("User:", user);
  const reqs = await recruitmentService.getRequisitions(user);
  console.log("Reqs:", JSON.stringify(reqs, null, 2));
}

test().catch(console.error).finally(() => prisma.$disconnect());
