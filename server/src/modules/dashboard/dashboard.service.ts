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

    // Upcoming interviews
    const upcomingInterviews = isAdmin ? await prisma.candidate.findMany({
      where: {
        interviewDate: { gte: now }
      },
      orderBy: { interviewDate: 'asc' },
      take: 5,
      include: {
        requisition: { select: { positionTitle: true } }
      }
    }) : [];

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
      upcomingInterviews,
    };
  }

  async getAttritionStats(currentUser: CurrentUser) {
    if (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR') {
      throw new Error('Only HR or Admin can access attrition data');
    }

    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear(now.getFullYear() - 1);

    // Fetch all employees to aggregate in-memory (fast for HR dashboards)
    const allEmployees = await prisma.employee.findMany({
      include: { department: true }
    });

    let startHeadcount = 0;
    let endHeadcount = 0;
    const leavers = [];
    const joiners = [];

    // Monthly buckets for the last 12 months
    const monthlyList = [];
    const monthlyMap: Record<string, any> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      const item = { month: key, joins: 0, exits: 0 };
      monthlyList.push(item);
      monthlyMap[key] = item;
    }

    // Process employees
    for (const emp of allEmployees) {
      const joinDate = new Date(emp.joiningDate);
      const exitDate = emp.lastWorkingDate ? new Date(emp.lastWorkingDate) : (emp.deactivatedAt ? new Date(emp.deactivatedAt) : (emp.status === 'RESIGNED' || emp.status === 'TERMINATED' ? new Date(emp.updatedAt) : null));
      
      const joinedBeforeStart = joinDate < twelveMonthsAgo;
      const leftBeforeStart = exitDate && exitDate < twelveMonthsAgo;
      const joinedBeforeEnd = joinDate <= now;
      const leftBeforeEnd = exitDate && exitDate <= now;

      // Start Headcount: Joined before the 12 month window, and haven't left before the window
      if (joinedBeforeStart && !leftBeforeStart) {
        startHeadcount++;
      }

      // End Headcount: Joined before now, and haven't left yet
      if (joinedBeforeEnd && !leftBeforeEnd) {
        endHeadcount++;
      }

      // Track joins within window
      if (joinDate >= twelveMonthsAgo && joinDate <= now) {
        joiners.push(emp);
        const mKey = joinDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (monthlyMap[mKey]) monthlyMap[mKey].joins++;
      }

      // Track exits within window
      if (exitDate && exitDate >= twelveMonthsAgo && exitDate <= now) {
        leavers.push(emp);
        const mKey = exitDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (monthlyMap[mKey]) monthlyMap[mKey].exits++;
      }
    }

    const averageStrength = (startHeadcount + endHeadcount) / 2;
    const attritionRate = averageStrength > 0 
      ? Math.round((leavers.length / averageStrength) * 100 * 10) / 10 
      : 0;

    // Breakdowns
    const deptBreakdown: Record<string, number> = {};
    const locBreakdown: Record<string, number> = {};
    const desigBreakdown: Record<string, number> = {};
    let voluntary = 0;
    let involuntary = 0;

    for (const l of leavers) {
      const dept = l.department?.name || 'Unassigned';
      deptBreakdown[dept] = (deptBreakdown[dept] || 0) + 1;
      
      const loc = l.location || l.city || 'Unknown';
      locBreakdown[loc] = (locBreakdown[loc] || 0) + 1;

      const desig = l.designation || 'Unknown';
      desigBreakdown[desig] = (desigBreakdown[desig] || 0) + 1;

      if (l.exitType === 'VOLUNTARY' || l.status === 'RESIGNED') {
        voluntary++;
      } else if (l.exitType === 'INVOLUNTARY' || l.status === 'TERMINATED') {
        involuntary++;
      } else {
        // Fallback guess
        voluntary++; 
      }
    }

    return {
      attritionRate,
      attritionCount: leavers.length,
      headcountAtStart: startHeadcount,
      averageStrength,
      voluntaryExits: voluntary,
      involuntaryExits: involuntary,
      departmentBreakdown: Object.entries(deptBreakdown).map(([name, count]) => ({ name, count })),
      locationBreakdown: Object.entries(locBreakdown).map(([name, count]) => ({ name, count })),
      designationBreakdown: Object.entries(desigBreakdown).map(([name, count]) => ({ name, count })),
      joinExitTrend: monthlyList,
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
