import prisma from '../../config/database';

export class LoginHistoryService {
  async getAllHistory() {
    return prisma.loginHistory.findMany({
      orderBy: { loginTime: 'desc' },
      include: {
        user: {
          select: { email: true, role: true }
        }
      }
    });
  }
}

export const loginHistoryService = new LoginHistoryService();
