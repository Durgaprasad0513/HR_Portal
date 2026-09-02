import re

with open("server/src/modules/requests/request.controller.ts", "r", encoding="utf-8") as f:
    content = f.read()

new_content = content.replace(
    "export const requestController = new RequestController();",
    """  getStaffUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const staff = await prisma.user.findMany({
        where: { role: { in: ['ADMIN', 'HR'] } },
        select: { id: true, email: true, employee: { select: { firstName: true, lastName: true } } }
      });
      res.json({ success: true, data: staff });
    } catch (error) {
      next(error);
    }
  };
}

export const requestController = new RequestController();"""
)

with open("server/src/modules/requests/request.controller.ts", "w", encoding="utf-8") as f:
    f.write(new_content)
print("Updated request controller")
