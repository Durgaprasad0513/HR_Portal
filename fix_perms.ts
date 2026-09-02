import prisma from './server/src/config/database';
import { Role } from '@prisma/client';

async function fixPermissions() {
  await prisma.modulePermission.updateMany({
    where: { role: Role.EMPLOYEE, module: 'performance' },
    data: { canEdit: true }
  });
  await prisma.modulePermission.updateMany({
    where: { role: Role.EMPLOYEE, module: 'training' },
    data: { canEdit: true }
  });
  console.log('Fixed permissions');
}
fixPermissions().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
