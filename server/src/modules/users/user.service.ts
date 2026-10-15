import prisma from '../../config/database';
import crypto from 'crypto';

export class UserManagementService {
  async createUser(data: { email: string, password: string, role: string, name: string }, adminUserId: string) {
    const fullName = data.name.trim();
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    const email = data.email.trim();
    if (!nameParts.length) throw new Error('Name is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('A valid email is required');
    const { hashPassword } = await import('../../utils/password');
    const hashed = await hashPassword(data.password);

    return prisma.$transaction(async (tx) => {
      const employee = await tx.employee.create({
        data: {
          employeeCode: `USR-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
          email,
          joiningDate: new Date(),
          designation: 'Not specified',
        },
      });
      const user = await tx.user.create({
        data: {
          email,
          password: hashed,
          role: data.role as any,
          employeeId: employee.id,
        },
      });

      await tx.auditLog.create({
        data: {
          actionPerformed: 'CREATE_USER',
          moduleAffected: 'roles',
          recordIdAffected: user.id,
          newValue: JSON.stringify({ email, role: data.role, employeeId: employee.id }),
          userId: adminUserId,
        },
      });

      return user;
    });
  }

  async getAllUsers(filters: any = {}) {
    const { search, role } = filters;

    const where: any = { deletedAt: null };
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { employee: { firstName: { contains: search, mode: 'insensitive' } } },
        { employee: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        twoFactorEnabled: true,
        passwordLastChangedAt: true,
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
            employeeCode: true,
            profilePhoto: true,
            department: { select: { name: true } },
          },
        },
        loginHistory: {
          select: { loginTime: true },
          orderBy: { loginTime: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(u => ({
      ...u,
      lastLogin: u.loginHistory[0]?.loginTime ?? null,
      loginHistory: undefined,
    }));
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        twoFactorEnabled: true,
        passwordLastChangedAt: true,
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
            employeeCode: true,
          },
        },
      },
    });
  }

  async changeRole(id: string, role: string, adminUserId: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { role: role as any },
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CHANGE_USER_ROLE',
        moduleAffected: 'roles',
        recordIdAffected: id,
        oldValue: undefined,
        newValue: JSON.stringify({ role }),
        userId: adminUserId,
      },
    });

    return user;
  }

  async toggleStatus(id: string, isActive: boolean, adminUserId: string) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        isActive,
        // Increment tokenVersion to invalidate all existing sessions
        tokenVersion: { increment: 1 },
        deactivatedAt: isActive ? null : new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
        moduleAffected: 'roles',
        recordIdAffected: id,
        newValue: JSON.stringify({ isActive }),
        userId: adminUserId,
      },
    });

    return user;
  }

  async resetPassword(id: string, newPassword: string, adminUserId: string) {
    const { hashPassword } = await import('../../utils/password');
    const hashed = await hashPassword(newPassword);

    const user = await prisma.user.update({
      where: { id },
      data: {
        password: hashed,
        passwordLastChangedAt: new Date(),
        tokenVersion: { increment: 1 },
      },
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'ADMIN_RESET_PASSWORD',
        moduleAffected: 'roles',
        recordIdAffected: id,
        userId: adminUserId,
      },
    });

    return user;
  }

  async removeUser(id: string, adminUserId: string) {
    if (id === adminUserId) throw new Error('You cannot remove your own account');

    const user = await prisma.user.findUnique({
      where: { id },
      include: { employee: { select: { id: true, employeeCode: true } } },
    });
    if (!user || user.deletedAt) throw new Error('User not found');
    if (user.role === 'ADMIN') throw new Error('Administrator accounts cannot be removed');

    const removedAt = new Date();
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          deletedAt: removedAt,
          isActive: false,
          deactivatedAt: removedAt,
          tokenVersion: { increment: 1 },
        },
      });

      // Role Management creates lightweight USR-* employee profiles for assignment
      // dropdowns. Deactivate those profiles too while retaining historical links.
      if (user.employee?.employeeCode.startsWith('USR-')) {
        await tx.employee.update({
          where: { id: user.employee.id },
          data: { isActive: false, status: 'INACTIVE', deactivatedAt: removedAt },
        });
      }

      await tx.auditLog.create({
        data: {
          actionPerformed: 'REMOVE_USER',
          moduleAffected: 'roles',
          recordIdAffected: id,
          oldValue: JSON.stringify({ email: user.email, role: user.role }),
          userId: adminUserId,
        },
      });
    });
  }
}

export const userManagementService = new UserManagementService();
