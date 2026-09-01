const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixPermissions() {
  await prisma.modulePermission.updateMany({
    where: { role: 'EMPLOYEE', module: 'performance' },
    data: { canEdit: true }
  });
  await prisma.modulePermission.updateMany({
    where: { role: 'EMPLOYEE', module: 'training' },
    data: { canEdit: true }
  });
  console.log('Fixed permissions');
}
fixPermissions().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
