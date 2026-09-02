const { PrismaClient } = require('./server/node_modules/@prisma/client');
const prisma = new PrismaClient();
async function main() {
    await prisma.user.updateMany({ data: { isActive: true } });
    await prisma.employee.updateMany({ data: { isActive: true } });
    console.log("DB Fixed");
}
main().catch(console.error).finally(() => prisma.$disconnect());
