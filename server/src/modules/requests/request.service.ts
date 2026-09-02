import prisma from '../../config/database';
import { notificationService } from '../notifications/notification.service';

export class RequestService {
  async createRequest(employeeId: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const createdAt = new Date();
    const year = createdAt.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    
    // Generate HR-YYYY-NNNNNN
    const count = await prisma.employeeRequest.count({
      where: {
        createdAt: {
          gte: startOfYear,
          lt: endOfYear
        }
      }
    });
    
    const formattedId = `HR-${year}-${String(count + 1).padStart(6, '0')}`;

    const slaDueDate = new Date(createdAt);
    slaDueDate.setDate(slaDueDate.getDate() + 3);
    
    const req = await prisma.employeeRequest.create({
      data: {
        ...data,
        id: formattedId,
        employeeId,
        slaDueDate
      }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'CREATE_REQUEST',
        moduleAffected: 'requests',
        recordIdAffected: req.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    await notificationService.notifyHRs({
      notificationType: 'QUERY_NOTIF',
      message: `New HR Helpdesk query submitted: ${req.id}`,
      triggerEvent: req.id
    });

    return req;
  }

  async getMyRequests(employeeId: string) {
    return prisma.employeeRequest.findMany({
      where: { employeeId },
      include: {
        assignedTo: { select: { id: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAllRequests(filters: any) {
    return prisma.employeeRequest.findMany({
      where: filters,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } },
        assignedTo: { select: { id: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async assignRequest(id: string, assignedToId: string, userId: string, reqContext: { ipAddress?: string } = {}) {
    const req = await prisma.employeeRequest.update({
      where: { id },
      data: { assignedToId }
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'ASSIGN_REQUEST',
        moduleAffected: 'requests',
        recordIdAffected: req.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    return req;
  }

  async updateRequestStatus(id: string, data: any, userId: string, reqContext: { ipAddress?: string } = {}) {
    const updateData: any = { ...data };
    if (data.status === 'RESOLVED') {
      updateData.resolutionDate = new Date();
    } else if (data.status === 'CLOSED') {
      updateData.closureDate = new Date();
    }
    const req = await prisma.employeeRequest.update({
      where: { id },
      data: updateData
    });

    await prisma.auditLog.create({
      data: {
        actionPerformed: 'UPDATE_REQUEST_STATUS',
        moduleAffected: 'requests',
        recordIdAffected: req.id,
        userId: userId,
        ipAddress: reqContext.ipAddress,
      }
    });

    if (data.status === 'RESOLVED' || data.status === 'TICKET_CLOSED') {
      await notificationService.createNotification({
        notificationType: 'QUERY_NOTIF',
        message: `Your HR Helpdesk query (${req.id}) has been ${data.status === 'RESOLVED' ? 'resolved' : 'closed'}.`,
        recipientId: req.employeeId,
        triggerEvent: req.id
      });
    }

    return req;
  }
}

export const requestService = new RequestService();
