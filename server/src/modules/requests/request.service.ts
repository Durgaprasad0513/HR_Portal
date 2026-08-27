import prisma from '../../config/database';

export class RequestService {
  async createRequest(employeeId: string, data: any) {
    const createdAt = new Date();
    const slaDueDate = new Date(createdAt);
    slaDueDate.setDate(slaDueDate.getDate() + 3);
    
    return prisma.employeeRequest.create({
      data: {
        ...data,
        employeeId,
        slaDueDate
      }
    });
  }

  async getMyRequests(employeeId: string) {
    return prisma.employeeRequest.findMany({
      where: { employeeId },
      include: {
        assignedTo: true
      }
    });
  }

  async getAllRequests(filters: any) {
    return prisma.employeeRequest.findMany({
      where: filters,
      include: {
        employee: true,
        assignedTo: true
      }
    });
  }

  async assignRequest(id: string, assignedToId: string) {
    return prisma.employeeRequest.update({
      where: { id },
      data: { assignedToId }
    });
  }

  async updateRequestStatus(id: string, data: any) {
    const updateData: any = { ...data };
    if (data.status === 'RESOLVED') {
      updateData.resolutionDate = new Date();
    } else if (data.status === 'CLOSED') {
      updateData.closureDate = new Date();
    }
    return prisma.employeeRequest.update({
      where: { id },
      data: updateData
    });
  }
}

export const requestService = new RequestService();
