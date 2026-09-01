import prisma from '../../config/database';
import { Role } from '@prisma/client';

interface CurrentUser {
  userId: string;
  role: string;
  employeeId?: string | null;
}

export class DashboardService {
  async getStats(currentUser: CurrentUser) {
    const isAdmin = currentUser.role === 'ADMIN' || currentUser.role === 'HR' || currentUser.role === 'REMOVED_ROLE';
    const isManager = currentUser.role === 'MANAGER';

    // Employee counts
    const totalEmployees = isAdmin
      ? await prisma.employee.count({ where: { isActive: true } })
      : isManager
      ? await prisma.employee.count({ where: { managerId: currentUser.employeeId!, isActive: true } })
      : 1;

    // Travel requests
    const travelWhere = isAdmin ? {} : isManager
      ? { employee: { managerId: currentUser.employeeId! } }
      : { employee: { id: currentUser.employeeId! } };

    const pendingTravel = await prisma.travelRequest.count({
      where: { ...travelWhere, approvalStatus: 'APPROVAL_PENDING' }
    });

    // Assets
    const totalAssets = isAdmin
      ? await prisma.asset.count()
      : await prisma.asset.count({ where: { assignedEmployeeId: currentUser.employeeId! } });

    // Open Requisitions (HR/Admin only)
    const openRequisitions = isAdmin
      ? await prisma.requisition.count({ where: { status: 'OPEN' } })
      : 0;

    // Open Leave requests
    const leaveWhere = isAdmin ? {} : isManager
      ? { employee: { managerId: currentUser.employeeId! } }
      : { employeeId: currentUser.employeeId! };

    const pendingLeaves = await prisma.leave.count({
      where: { ...leaveWhere, status: 'PENDING' }
    });

    // Performance reviews pending HR approval
    const pendingReviews = isAdmin
      ? await prisma.performanceReview.count({ where: { finalApprovalStatus: 'APPROVAL_PENDING' } })
      : 0;

    // Training this month
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const trainingsThisMonth = await prisma.training.count({
      where: { trainingDate: { gte: firstOfMonth } }
    });

    // Candidates
    const totalCandidates = isAdmin ? await prisma.candidate.count() : 0;
    const invitedForInterview = isAdmin ? await prisma.candidate.count({ where: { screeningStatus: 'SHORTLISTED' } }) : 0;
    const appliedForInterview = isAdmin ? await prisma.candidate.count({ where: { screeningStatus: 'SCREENING_PENDING' } }) : 0;

    return {
      totalEmployees,
      pendingTravel,
      totalAssets,
      openRequisitions,
      pendingLeaves,
      pendingReviews,
      trainingsThisMonth,
      totalCandidates,
      invitedForInterview,
      appliedForInterview,
    };
  }

  async getAttritionStats(currentUser: CurrentUser) {
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR') {
      throw new Error('Only HR or Admin can access attrition data');
    }

    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear(now.getFullYear() - 1);

    // Total headcount at start of window
    const headcountAtStart = await prisma.employee.count({
      where: {
        OR: [
          { isActive: true },
          { AND: [{ isActive: false }, { updatedAt: { gte: twelveMonthsAgo } }] }
        ]
      }
    });

    // Employees who left in the window (inactive employees updated in last 12 months)
    const attritionCount = await prisma.employee.count({
      where: {
        isActive: false,
        updatedAt: { gte: twelveMonthsAgo }
      }
    });

    const attritionRate = headcountAtStart > 0
      ? Math.round((attritionCount / headcountAtStart) * 100 * 10) / 10
      : 0;

    // Department breakdown
    const deptBreakdown = await prisma.department.findMany({
      select: {
        name: true,
        _count: {
          select: { employees: true }
        }
      }
    });

    // Role distribution
    const roleDistribution: Record<string, number> = {};
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      include: { user: { select: { role: true } } }
    });
    for (const emp of employees) {
      const role = emp.user?.role || 'EMPLOYEE';
      roleDistribution[role] = (roleDistribution[role] || 0) + 1;
    }

    // Monthly join trend (last 6 months)
    const joinTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const count = await prisma.employee.count({
        where: { joiningDate: { gte: monthStart, lte: monthEnd } }
      });
      joinTrend.push({
        month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
        count
      });
    }

    return {
      attritionRate,
      attritionCount,
      headcountAtStart,
      departmentBreakdown: deptBreakdown.map(d => ({ department: d.name, count: d._count.employees })),
      roleDistribution,
      joinTrend,
    };
  }

  async getReport(type: string, currentUser: CurrentUser) {
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR') {
      throw new Error('Only HR or Admin can access reports');
    }

    switch (type) {
      case 'employees':
        return this.getEmployeeReport();
      case 'travel':
        return this.getTravelReport();
      case 'assets':
        return this.getAssetReport();
      case 'recruitment':
        return this.getRecruitmentReport();
      case 'training':
        return this.getTrainingReport();
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }

  private async getEmployeeReport() {
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      include: {
        department: { select: { name: true } },
        user: { select: { role: true } }
      },
      orderBy: { firstName: 'asc' }
    });
    return employees.map(e => ({
      id: e.id,
      name: `${e.firstName} ${e.lastName}`,
      email: e.email,
      department: e.department?.name || 'N/A',
      role: e.user?.role || 'EMPLOYEE',
      designation: e.designation,
      joiningDate: e.joiningDate
    }));
  }

  private async getTravelReport() {
    const requests = await prisma.travelRequest.findMany({
      include: {
        employee: { select: { firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 1000
    });
    return requests.map(r => ({
      id: r.id,
      employee: `${r.employee.firstName} ${r.employee.lastName}`,
      destination: r.destination,
      startDate: r.startDate,
      endDate: r.endDate,
      approvalStatus: r.approvalStatus,
      settlementStatus: r.settlementStatus,
      totalExpenseClaimed: r.totalExpenseClaimed
    }));
  }

  private async getAssetReport() {
    const assets = await prisma.asset.findMany({
      include: {
        assignedEmployee: { select: { firstName: true, lastName: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return assets.map(a => ({
      id: a.id,
      assetType: a.assetType,
      brandModel: a.brandModel,
      serialNumber: a.serialNumber,
      status: a.status,
      assignedTo: a.assignedEmployee ? `${a.assignedEmployee.firstName} ${a.assignedEmployee.lastName}` : null
    }));
  }

  private async getRecruitmentReport() {
    const candidates = await prisma.candidate.findMany({
      include: {
        requisition: { select: { positionTitle: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return candidates.map(c => ({
      id: c.id,
      name: c.candidateName,
      email: c.email,
      position: c.requisition?.positionTitle || 'N/A',
      screeningStatus: c.screeningStatus,
      selectionStatus: c.selectionStatus,
      offerStatus: c.offerStatus
    }));
  }

  private async getTrainingReport() {
    const trainings = await prisma.training.findMany({
      include: {
        _count: { select: { participants: true } }
      },
      orderBy: { trainingDate: 'desc' }
    });
    return trainings.map(t => ({
      id: t.id,
      topic: t.trainingTopic,
      type: t.trainingType,
      date: t.trainingDate,
      participantCount: t._count.participants,
      cost: t.trainingCost
    }));
  }
}

export const dashboardService = new DashboardService();
