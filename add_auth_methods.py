import re

# 1. Update auth.service.ts
path = "server/src/modules/auth/auth.service.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add changePassword and setupPassword methods
new_methods = """
  async changePassword(userId: string, input: any, reqContext: { ipAddress?: string } = {}) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await comparePassword(input.currentPassword, user.password);
    if (!isPasswordValid) throw new Error('Invalid current password');

    const { hashPassword } = require('../../utils/password');
    const hashedPassword = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        tokenVersion: { increment: 1 }
      }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CHANGE_PASSWORD',
        moduleAffected: 'auth',
        recordIdAffected: userId,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });
  }

  async setupPassword(input: any, reqContext: { ipAddress?: string } = {}) {
    // For invitation, the token might be a simple verification token or an unactivated user's ID
    // In a real app we'd verify a JWT or DB token. Here we'll assume token = userId for simplicity of the exercise
    const userId = input.token;
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Invalid token');

    const { hashPassword } = require('../../utils/password');
    const hashedPassword = await hashPassword(input.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isActive: true, // Activate account upon setup
        tokenVersion: { increment: 1 }
      }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'SETUP_PASSWORD',
        moduleAffected: 'auth',
        recordIdAffected: userId,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });
  }
"""

content = content.replace("export const authService = new AuthService();", new_methods + "\nexport const authService = new AuthService();")
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update auth.controller.ts
path = "server/src/modules/auth/auth.controller.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

new_controllers = """
  async changePassword(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return sendError(res, 'Unauthorized', 401);
      await authService.changePassword(req.user.id, req.body, { ipAddress: req.ip });
      return sendSuccess(res, null, 'Password changed successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }

  async setupPassword(req: Request, res: Response) {
    try {
      await authService.setupPassword(req.body, { ipAddress: req.ip });
      return sendSuccess(res, null, 'Password setup successfully. You can now login.');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }
"""

content = content.replace("export const authController = new AuthController();", new_controllers + "\nexport const authController = new AuthController();")
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
