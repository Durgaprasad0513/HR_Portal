import re

path = "server/tests/smoke.test.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

after_all = """  afterAll(async () => {
    // Reactivate Ananya to prevent subsequent test failures
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.user.updateMany({
      where: { email: 'ananya.patel@hrms.com' },
      data: { isActive: true }
    });
    await prisma.employee.updateMany({
      where: { email: 'ananya.patel@hrms.com' },
      data: { isActive: true }
    });
    await prisma.$disconnect();
  });
});
"""

# Replace the last `});`
content = re.sub(r"\}\);\n$", after_all, content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
