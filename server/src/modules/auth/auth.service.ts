import prisma from '../../config/database';
import { hashPassword } from '../../utils/password';
import { comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import { LoginInput } from './auth.schema';
import { permissionService } from '../permissions/permission.service';
import { ROLE_LABELS } from '../permissions/permission.catalog';

export class AuthService {
  async login(input: LoginInput, reqContext: { ipAddress?: string, deviceBrowser?: string } = {}) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            designation: true,
            profilePhoto: true,
            department: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated. Contact your administrator.');
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      await prisma.auditLog.create({
        data: {
          actionPerformed: 'FAILED_LOGIN',
          moduleAffected: 'auth',
          userId: user.id,
          ipAddress: reqContext.ipAddress,
        }
      });
      throw new Error('Invalid email or password');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      tokenVersion: user.tokenVersion,
    });

    
    // Log successful login
    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress: reqContext.ipAddress,
        deviceBrowser: reqContext.deviceBrowser,
      }
    });

    const permissions = await permissionService.getForRole(user.role);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        roleLabel: ROLE_LABELS[user.role],
        employeeId: user.employeeId,
      tokenVersion: user.tokenVersion,
        employee: user.employee,
        permissions,
      },
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        employeeId: true,
        employee: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
            email: true,
            designation: true,
            profilePhoto: true,
            department: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const permissions = await permissionService.getForRole(user.role);
    return {
      ...user,
      roleLabel: ROLE_LABELS[user.role],
      permissions,
    };
  }


  async changePassword(userId: string, input: any, reqContext: { ipAddress?: string } = {}) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const isPasswordValid = await comparePassword(input.currentPassword, user.password);
    if (!isPasswordValid) throw new Error('Invalid current password');

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
}

export const authService = new AuthService();
