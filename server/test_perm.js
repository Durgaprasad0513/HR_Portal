const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const perm = await prisma.modulePermission.findUnique({
    where: { role_module: { role: 'EMPLOYEE', module: 'assets' } }
  });
  console.log(perm);
}
test();
