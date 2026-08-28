import prisma from '../../config/database';

export class TrainingService {
  async getAllTrainings(filters: any) {
    return prisma.training.findMany({
      where: filters,
      include: {
        targetDepartment: true,
        participants: true
      }
    });
  }

  async getMyTrainings(employeeId: string) {
    return prisma.trainingParticipant.findMany({
      where: { employeeId },
      include: {
        training: true
      }
    });
  }

  async createTraining(data: any) {
    return prisma.training.create({ data });
  }

  async updateTraining(id: string, data: any) {
    return prisma.training.update({
      where: { id },
      data
    });
  }

  async addParticipant(trainingId: string, employeeId: string) {
    return prisma.trainingParticipant.create({
      data: {
        trainingId,
        employeeId
      }
    });
  }

  async removeParticipant(trainingId: string, employeeId: string) {
    return prisma.trainingParticipant.delete({
      where: {
        trainingId_employeeId: {
          trainingId,
          employeeId
        }
      }
    });
  }

  async updateParticipant(trainingId: string, employeeId: string, data: any) {
    return prisma.trainingParticipant.update({
      where: {
        trainingId_employeeId: {
          trainingId,
          employeeId
        }
      },
      data
    });
  }
}

export const trainingService = new TrainingService();
