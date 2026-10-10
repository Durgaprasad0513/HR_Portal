import prisma from "../../config/database";
import { notificationService } from "../notifications/notification.service";
import { Role, Prisma, RequisitionStatus } from "@prisma/client";
import { getModuleScope } from "../../utils/authorization";
import { permissionService } from "../permissions/permission.service";

interface CurrentUser {
  id: string;
  userId: string;
  email: string;
  role: string;
  employeeId?: string | null;
}

export class RecruitmentService {
  async protectCandidateCompensation<T extends Record<string, any>>(
    rows: T[],
    role: Role,
  ): Promise<T[]> {
    if (await permissionService.canViewRestricted(role, "recruitment"))
      return rows;
    return rows.map((row) => {
      const {
        currentSalary,
        expectedSalary,
        offeredSalary,
        recruitmentCost,
        ...safe
      } = row;
      return safe as T;
    });
  }

  private async assertCandidateAccess(candidateId: string, userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { requisition: true },
    });
    if (!user || !candidate) throw new Error("Candidate not found.");
    const scope = getModuleScope(user.role, "recruitment");
    if (
      scope !== "ORG" &&
      (!user.employeeId || candidate.requisition.raisedById !== user.employeeId)
    ) {
      throw new Error("Unauthorized to access this candidate.");
    }
  }

  private async closeFilledRequisition(
    tx: Prisma.TransactionClient,
    requisitionId: string,
    userId: string,
    ipAddress?: string,
  ) {
    const requisition = await tx.requisition.findUniqueOrThrow({
      where: { id: requisitionId },
    });
    const selectedCount = await tx.candidate.count({
      where: {
        requisitionId,
        selectionStatus: "SELECTED",
        OR: [{ offerStatus: null }, { offerStatus: { not: "OFFER_DECLINED" } }],
      },
    });
    if (selectedCount > requisition.numberOfVacancies)
      throw new Error(
        "All vacancies are already filled. Increase the vacancy count before selecting another candidate.",
      );
    if (selectedCount < requisition.numberOfVacancies) {
      if (requisition.status === "CLOSED") {
        const lastClosure = await tx.auditLog.findFirst({
          where: {
            moduleAffected: "recruitment",
            recordIdAffected: requisitionId,
            actionPerformed: {
              in: ["CLOSE_FILLED_REQUISITION", "UPDATE_REQUISITION_STATUS"],
            },
          },
          orderBy: { createdAt: "desc" },
        });
        if (
          requisition.closureSource === "AUTO_FILLED" ||
          (!requisition.closureSource &&
            lastClosure?.actionPerformed === "CLOSE_FILLED_REQUISITION")
        ) {
          let previousStatus: string | undefined;
          try {
            previousStatus = JSON.parse(lastClosure?.oldValue || "{}").status;
          } catch {
            /* Legacy audit data falls back to REQUIREMENT. */
          }
          const restoredStatus =
            previousStatus &&
            Object.values(RequisitionStatus).includes(
              previousStatus as RequisitionStatus,
            ) &&
            !["CLOSED", "JOINED_REJECTED"].includes(previousStatus)
              ? (previousStatus as RequisitionStatus)
              : "REQUIREMENT";
          await tx.requisition.update({
            where: { id: requisitionId },
            data: {
              status: restoredStatus,
              stageUpdatedAt: new Date(),
              closureSource: null,
              closureReason: null,
            },
          });
          await tx.auditLog.create({
            data: {
              actionPerformed: "REOPEN_UNFILLED_REQUISITION",
              moduleAffected: "recruitment",
              recordIdAffected: requisitionId,
              userId,
              ipAddress,
            },
          });
        }
      }
      return;
    }
    const { count: closedCount } = await tx.requisition.updateMany({
      where: {
        id: requisitionId,
        status: { notIn: ["CLOSED", "JOINED_REJECTED"] },
      },
      data: {
        status: "CLOSED",
        stageUpdatedAt: new Date(),
        closureSource: "AUTO_FILLED",
        closureReason: "All vacancies are reserved by selected candidates.",
      },
    });
    if (!closedCount) return;

    await tx.auditLog.create({
      data: {
        actionPerformed: "CLOSE_FILLED_REQUISITION",
        oldValue: JSON.stringify({ status: requisition.status }),
        moduleAffected: "recruitment",
        recordIdAffected: requisitionId,
        userId,
        ipAddress,
      },
    });
  }

  async createRequisition(
    data: any,
    raisedByEmployeeId: string,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    const department = await prisma.department.findUnique({
      where: { id: data.departmentId },
      select: { id: true },
    });
    if (!department) throw new Error("Department not found.");

    return prisma.$transaction(async (tx) => {
      const req = await tx.requisition.create({
        data: {
          ...data,
          raisedById: raisedByEmployeeId,
          status: "REQUIREMENT",
        },
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: "CREATE_REQUISITION",
          moduleAffected: "recruitment",
          recordIdAffected: req.id,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      return req;
    });
  }

  async updateRequisition(
    id: string,
    data: any,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    const req = await prisma.requisition.findUnique({ where: { id } });
    if (!req) throw new Error("Requisition not found.");

    if (data.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId },
        select: { id: true },
      });
      if (!department) throw new Error("Department not found.");
    }

    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM requisitions WHERE id = ${id} FOR UPDATE`;
      const updated = await tx.requisition.update({
        where: { id },
        data: {
          positionTitle: data.positionTitle,
          departmentId: data.departmentId,
          location: data.location,
          numberOfVacancies: data.numberOfVacancies,
        },
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: "UPDATE_REQUISITION",
          moduleAffected: "recruitment",
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      if (data.numberOfVacancies !== undefined) {
        await this.closeFilledRequisition(tx, id, userId, reqContext.ipAddress);
        return tx.requisition.findUniqueOrThrow({ where: { id } });
      }
      return updated;
    });
  }

  async getRequisitions(currentUser: CurrentUser, filters: any = {}) {
    const scope = getModuleScope(currentUser.role as Role, "recruitment");
    if (scope !== "ORG" && !currentUser.employeeId) return [];

    let scopeQuery: Prisma.RequisitionWhereInput = {};
    if (scope === "SELF") {
      scopeQuery = {
        OR: [
          { raisedById: currentUser.employeeId! },
          { status: { not: "JOINED_REJECTED" } },
        ],
      };
    } else if (scope === "TEAM") {
      const emp = await prisma.employee.findUnique({
        where: { id: currentUser.employeeId! },
        select: { departmentId: true },
      });
      scopeQuery = {
        OR: [
          { departmentId: emp?.departmentId || undefined },
          { status: { not: "JOINED_REJECTED" } },
        ],
      };
    }

    const requisitions = await prisma.requisition.findMany({
      where: { ...filters, ...scopeQuery },
      include: {
        department: true,
        raisedBy: { select: { id: true, firstName: true, lastName: true } },
        candidates: {
          select: {
            selectionStatus: true,
            interviewRound: true,
            offerStatus: true,
            updatedAt: true,
          },
        },
        _count: { select: { candidates: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return requisitions.map(({ candidates, ...requisition }) => ({
      ...requisition,
      candidates,
      selectedCount: candidates.filter(
        (candidate) =>
          candidate.selectionStatus === "SELECTED" &&
          candidate.offerStatus !== "OFFER_DECLINED",
      ).length,
      filledCount: candidates.filter(
        (candidate) =>
          candidate.selectionStatus === "SELECTED" &&
          candidate.offerStatus !== "OFFER_DECLINED",
      ).length,
      remainingCount: Math.max(
        0,
        requisition.numberOfVacancies -
          candidates.filter(
            (candidate) =>
              candidate.selectionStatus === "SELECTED" &&
              candidate.offerStatus !== "OFFER_DECLINED",
          ).length,
      ),
      offerCount: candidates.filter(
        (candidate) =>
          candidate.interviewRound
            ?.trim()
            .toUpperCase()
            .replace(/[\s-]+/g, "_") === "OFFER" ||
          candidate.offerStatus === "RELEASED" ||
          candidate.offerStatus === "OFFER_ACCEPTED",
      ).length,
    }));
  }

  async updateRequisitionStatus(
    id: string,
    data: any,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    const req = await prisma.requisition.findUnique({ where: { id } });
    if (!req) throw new Error("Requisition not found.");
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "requisitions" WHERE "id" = ${id} FOR UPDATE`;
      const locked = await tx.requisition.findUniqueOrThrow({ where: { id } });
      if (
        ["CLOSED", "JOINED_REJECTED"].includes(locked.status) &&
        !["CLOSED", "JOINED_REJECTED"].includes(data.status)
      ) {
        const filled = await tx.candidate.count({
          where: {
            requisitionId: id,
            selectionStatus: "SELECTED",
            OR: [
              { offerStatus: null },
              { offerStatus: { not: "OFFER_DECLINED" } },
            ],
          },
        });
        if (filled >= locked.numberOfVacancies)
          throw new Error(
            "All vacancies are reserved. Increase capacity before reopening.",
          );
      }

      const updated = await tx.requisition.update({
        where: { id },
        data: {
          status: data.status,
          stageUpdatedAt: new Date(),
          closureSource: ["CLOSED", "JOINED_REJECTED"].includes(data.status)
            ? "MANUAL"
            : null,
          closureReason: data.reason || null,
        },
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: "UPDATE_REQUISITION_STATUS",
          moduleAffected: "recruitment",
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      return updated;
    });
  }

  async createCandidate(
    data: any,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "requisitions" WHERE "id" = ${data.requisitionId} FOR UPDATE`;
      const requisition = await tx.requisition.findUnique({
        where: { id: data.requisitionId },
      });
      if (!requisition) throw new Error("Requisition not found.");
      if (["CLOSED", "JOINED_REJECTED"].includes(requisition.status))
        throw new Error(
          "This requisition is closed. Reopen it before scheduling a candidate.",
        );
      const {
        interviewDurationMinutes = 60,
        interviewMode = "IN_PERSON",
        ...candidateData
      } = data;
      const candidate = await tx.candidate.create({ data: candidateData });
      if (candidate.interviewDate) {
        const endsAt = new Date(
          candidate.interviewDate.getTime() + interviewDurationMinutes * 60000,
        );
        if (candidate.interviewerId) {
          await tx.$queryRaw`SELECT "id" FROM "employees" WHERE "id" = ${candidate.interviewerId} FOR UPDATE`;
          const conflict = await tx.interview.findFirst({
            where: {
              interviewerId: candidate.interviewerId,
              status: "SCHEDULED",
              startsAt: { lt: endsAt },
              endsAt: { gt: candidate.interviewDate },
            },
          });
          if (conflict)
            throw new Error(
              "This interviewer already has an interview during that time.",
            );
        }
        await tx.interview.create({
          data: {
            candidateId: candidate.id,
            round: candidate.interviewRound || "TELEPHONIC",
            startsAt: candidate.interviewDate,
            endsAt: new Date(
              candidate.interviewDate.getTime() +
                interviewDurationMinutes * 60 * 1000,
            ),
            mode: interviewMode,
            location: candidate.interviewLocation,
            interviewerId: candidate.interviewerId,
            createdById: userId,
          },
        });
      }
      await tx.auditLog.create({
        data: {
          actionPerformed: "CREATE_CANDIDATE",
          moduleAffected: "recruitment",
          recordIdAffected: candidate.id,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      return candidate;
    });
  }

  async getAllInterviews(currentUser: CurrentUser) {
    const scope = getModuleScope(currentUser.role as Role, "recruitment");
    if (scope !== "ORG" && !currentUser.employeeId) return [];
    const whereClause: any = {
      OR: [
        { interviewDate: { not: null } },
        { interviewRound: "OFFER" },
        {
          offerStatus: { in: ["RELEASED", "OFFER_ACCEPTED", "OFFER_DECLINED"] },
        },
      ],
    };

    let requisitionScope: any = {};
    if (scope === "SELF") {
      requisitionScope = { raisedById: currentUser.employeeId };
    } else if (scope === "TEAM") {
      const emp = await prisma.employee.findUnique({
        where: { id: currentUser.employeeId! },
        select: { departmentId: true },
      });
      requisitionScope = { departmentId: emp?.departmentId };
    }

    const candidates = await prisma.candidate.findMany({
      where: Object.keys(requisitionScope).length
        ? { requisition: requisitionScope }
        : {},
      include: {
        interviews: {
          include: {
            interviewer: { select: { firstName: true, lastName: true } },
          },
          orderBy: { startsAt: "asc" },
        },
        requisition: { select: { positionTitle: true } },
        interviewer: { select: { firstName: true, lastName: true } },
      },
      orderBy: { interviewDate: "asc" },
    });
    const historical = candidates.flatMap((candidate) =>
      candidate.interviews.map((interview) => ({
        ...candidate,
        ...interview,
        candidateId: candidate.id,
        id: candidate.id,
        interviewId: interview.id,
        interviewDate: interview.startsAt,
        interviewRound: interview.round,
        interviewLocation: interview.location,
        interviewFeedback: interview.feedback,
        interviewScore: interview.score,
        interviewer: interview.interviewer,
        interviews: undefined,
      })),
    );
    const legacy = await prisma.candidate.findMany({
      where: {
        ...whereClause,
        ...(Object.keys(requisitionScope).length
          ? { requisition: requisitionScope }
          : {}),
        interviews: { none: {} },
      },
      include: {
        requisition: { select: { positionTitle: true } },
        interviewer: { select: { firstName: true, lastName: true } },
      },
      orderBy: { interviewDate: "asc" },
    });
    const allRows = [
      ...historical,
      ...legacy.map((candidate) => ({
        ...candidate,
        interviewId: null,
        status:
          candidate.interviewFeedback === "Finished"
            ? "COMPLETED"
            : "SCHEDULED",
      })),
    ].sort(
      (a, b) =>
        new Date(a.interviewDate || 0).getTime() -
        new Date(b.interviewDate || 0).getTime(),
    );
    return this.protectCandidateCompensation(allRows, currentUser.role as Role);
  }

  async getCandidates(currentUser: CurrentUser, filters: any = {}) {
    const role = currentUser.role as Role;
    const scope = getModuleScope(role, "recruitment");
    if (scope !== "ORG" && !currentUser.employeeId)
      return { items: [], total: 0, page: 1, pageSize: 50 };
    const departmentId =
      scope === "TEAM"
        ? (
            await prisma.employee.findUnique({
              where: { id: currentUser.employeeId! },
              select: { departmentId: true },
            })
          )?.departmentId
        : undefined;
    const page = Math.max(
      1,
      Number.parseInt(String(filters.page || "1"), 10) || 1,
    );
    const pageSize = Math.min(
      100,
      Math.max(1, Number.parseInt(String(filters.pageSize || "50"), 10) || 50),
    );
    const query = String(filters.search || "").trim();
    const where: Prisma.CandidateWhereInput = {
      ...(scope === "SELF"
        ? { requisition: { raisedById: currentUser.employeeId! } }
        : scope === "TEAM"
          ? { requisition: { departmentId } }
          : {}),
      ...(filters.requisitionId
        ? { requisitionId: String(filters.requisitionId) }
        : {}),
      ...(filters.stage === "SCREENING"
        ? {
            interviewRound: null,
            screeningStatus: { in: ["SCREENING_PENDING", "SHORTLISTED"] },
          }
        : filters.stage
          ? { interviewRound: String(filters.stage) }
          : {}),
      ...(filters.outcome === "IN_PROGRESS"
        ? { selectionStatus: null }
        : filters.outcome
          ? { selectionStatus: String(filters.outcome) as any }
          : {}),
      ...(query
        ? {
            OR: [
              { candidateName: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const [total, rows] = await prisma.$transaction([
      prisma.candidate.count({ where }),
      prisma.candidate.findMany({
        where,
        include: {
          requisition: {
            select: { id: true, positionTitle: true, location: true },
          },
          interviewer: {
            select: { id: true, firstName: true, lastName: true },
          },
          interviews: {
            where: { status: "SCHEDULED" },
            orderBy: { startsAt: "asc" },
            take: 1,
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    const safeRows = await this.protectCandidateCompensation(rows, role);
    return { items: safeRows, total, page, pageSize };
  }

  async getCandidatesByRequisition(
    requisitionId: string,
    currentUser: CurrentUser,
  ) {
    const scope = getModuleScope(currentUser.role as Role, "recruitment");
    const req = await prisma.requisition.findUnique({
      where: { id: requisitionId },
    });

    if (scope === "SELF") {
      if (req?.raisedById !== currentUser.employeeId)
        throw new Error("Unauthorized to view candidates for this requisition");
    } else if (scope === "TEAM") {
      const emp = await prisma.employee.findUnique({
        where: { id: currentUser.employeeId! },
        select: { departmentId: true },
      });
      if (req?.departmentId !== emp?.departmentId)
        throw new Error("Unauthorized to view candidates for this requisition");
    }

    const rows = await prisma.candidate.findMany({
      where: { requisitionId },
      include: {
        interviewer: { select: { id: true, firstName: true, lastName: true } },
        requisition: { select: { id: true, positionTitle: true } },
        interviews: {
          orderBy: { startsAt: "asc" },
          include: {
            interviewer: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const activity = await prisma.auditLog.findMany({
      where: {
        moduleAffected: "recruitment",
        recordIdAffected: { in: rows.map((row) => row.id) },
      },
      select: {
        id: true,
        recordIdAffected: true,
        actionPerformed: true,
        createdAt: true,
        user: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return this.protectCandidateCompensation(
      rows.map((row) => ({
        ...row,
        activity: activity.filter((event) => event.recordIdAffected === row.id),
      })),
      currentUser.role as Role,
    );
  }

  async createInterview(
    candidateId: string,
    data: any,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    await this.assertCandidateAccess(candidateId, userId);
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "candidates" WHERE "id" = ${candidateId} FOR UPDATE`;
      const candidate = await tx.candidate.findUnique({
        where: { id: candidateId },
      });
      if (!candidate) throw new Error("Candidate not found.");
      if (candidate.selectionStatus === "SELECTION_REJECTED")
        throw new Error("A rejected candidate cannot be scheduled.");
      if (data.interviewerId) {
        await tx.$queryRaw`SELECT "id" FROM "employees" WHERE "id" = ${data.interviewerId} FOR UPDATE`;
        const conflict = await tx.interview.findFirst({
          where: {
            interviewerId: data.interviewerId,
            status: "SCHEDULED",
            startsAt: { lt: new Date(data.endsAt) },
            endsAt: { gt: new Date(data.startsAt) },
          },
        });
        if (conflict)
          throw new Error(
            "This interviewer already has an interview during that time.",
          );
      }
      const overlap = await tx.interview.findFirst({
        where: {
          candidateId,
          status: "SCHEDULED",
          startsAt: { lt: new Date(data.endsAt) },
          endsAt: { gt: new Date(data.startsAt) },
        },
      });
      if (overlap)
        throw new Error(
          "This candidate already has an interview during that time.",
        );
      const { reason: _reason, ...schedule } = data;
      const interview = await tx.interview.create({
        data: { ...schedule, candidateId, createdById: userId },
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: "SCHEDULE_INTERVIEW",
          moduleAffected: "recruitment",
          recordIdAffected: candidateId,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      await tx.candidate.update({
        where: { id: candidateId },
        data: {
          interviewDate: new Date(data.startsAt),
          interviewRound: data.round,
          interviewLocation: data.location || null,
          interviewerId: data.interviewerId || null,
        },
      });
      return interview;
    });
  }

  async rescheduleInterview(
    interviewId: string,
    data: any,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    const appointment = await prisma.interview.findUnique({
      where: { id: interviewId },
    });
    if (!appointment) throw new Error("Interview not found.");
    await this.assertCandidateAccess(appointment.candidateId, userId);
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "candidates" WHERE "id" = ${appointment.candidateId} FOR UPDATE`;
      const existing = await tx.interview.findUnique({
        where: { id: interviewId },
      });
      if (!existing || existing.status !== "SCHEDULED")
        throw new Error("Only a scheduled interview can be rescheduled.");
      if (data.interviewerId) {
        await tx.$queryRaw`SELECT "id" FROM "employees" WHERE "id" = ${data.interviewerId} FOR UPDATE`;
        const conflict = await tx.interview.findFirst({
          where: {
            id: { not: interviewId },
            interviewerId: data.interviewerId,
            status: "SCHEDULED",
            startsAt: { lt: new Date(data.endsAt) },
            endsAt: { gt: new Date(data.startsAt) },
          },
        });
        if (conflict)
          throw new Error(
            "This interviewer already has an interview during that time.",
          );
      }
      const overlap = await tx.interview.findFirst({
        where: {
          id: { not: interviewId },
          candidateId: appointment.candidateId,
          status: "SCHEDULED",
          startsAt: { lt: new Date(data.endsAt) },
          endsAt: { gt: new Date(data.startsAt) },
        },
      });
      if (overlap)
        throw new Error(
          "This candidate already has an interview during that time.",
        );
      const { reason, ...schedule } = data;
      const { count } = await tx.interview.updateMany({
        where: { id: interviewId, status: "SCHEDULED" },
        data: { status: "CANCELLED" },
      });
      if (!count)
        throw new Error(
          "This interview was updated by someone else. Refresh and try again.",
        );
      const replacement = await tx.interview.create({
        data: {
          ...schedule,
          candidateId: existing.candidateId,
          createdById: userId,
        },
      });
      await tx.candidate.update({
        where: { id: existing.candidateId },
        data: {
          interviewDate: replacement.startsAt,
          interviewRound: replacement.round,
          interviewLocation: replacement.location,
          interviewerId: replacement.interviewerId,
        },
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: "RESCHEDULE_INTERVIEW",
          oldValue: JSON.stringify({
            startsAt: existing.startsAt,
            endsAt: existing.endsAt,
            location: existing.location,
            reason,
          }),
          moduleAffected: "recruitment",
          recordIdAffected: existing.candidateId,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      return replacement;
    });
  }

  async updateInterviewStatus(
    interviewId: string,
    data: any,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    const appointment = await prisma.interview.findUnique({
      where: { id: interviewId },
    });
    if (!appointment) throw new Error("Interview not found.");
    await this.assertCandidateAccess(appointment.candidateId, userId);
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
    });
    if (!interview) throw new Error("Interview not found.");
    if (interview.status !== "SCHEDULED")
      throw new Error(
        "Only scheduled interviews can change appointment status.",
      );
    if (data.status === "SCHEDULED")
      throw new Error("Use reschedule to change an interview time.");
    return prisma.$transaction(async (tx) => {
      const { count } = await tx.interview.updateMany({
        where: { id: interviewId, status: interview.status },
        data: { status: data.status },
      });
      if (!count)
        throw new Error(
          "This interview was updated by someone else. Refresh and try again.",
        );
      const updated = await tx.interview.findUniqueOrThrow({
        where: { id: interviewId },
      });
      if (data.status === "CANCELLED" || data.status === "NO_SHOW") {
        const next = await tx.interview.findFirst({
          where: { candidateId: interview.candidateId, status: "SCHEDULED" },
          orderBy: { startsAt: "asc" },
        });
        await tx.candidate.update({
          where: { id: interview.candidateId },
          data: {
            interviewDate: next?.startsAt || null,
            interviewRound: next?.round || null,
            interviewLocation: next?.location || null,
            interviewerId: next?.interviewerId || null,
          },
        });
      } else if (data.status === "SCHEDULED") {
        await tx.candidate.update({
          where: { id: interview.candidateId },
          data: {
            interviewDate: interview.startsAt,
            interviewRound: interview.round,
            interviewLocation: interview.location,
            interviewerId: interview.interviewerId,
          },
        });
      }
      await tx.auditLog.create({
        data: {
          actionPerformed: `INTERVIEW_${data.status}`,
          oldValue: data.reason || null,
          moduleAffected: "recruitment",
          recordIdAffected: interview.candidateId,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      return updated;
    });
  }

  async submitInterviewFeedback(
    interviewId: string,
    data: any,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    const appointment = await prisma.interview.findUnique({
      where: { id: interviewId },
    });
    if (!appointment) throw new Error("Interview not found.");
    await this.assertCandidateAccess(appointment.candidateId, userId);
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "recruitment_interviews" WHERE "id" = ${interviewId} FOR UPDATE`;
      const interview = await tx.interview.findUnique({ where: { id: interviewId } });
      if (!interview) throw new Error("Interview not found.");
      if (interview.status !== "COMPLETED")
        throw new Error("Complete the interview before submitting feedback.");
      if (!data.draft && interview.feedback && !data.revisionReason)
        throw new Error("A reason is required to revise submitted feedback.");
      const updated = await tx.interview.update({
        where: { id: interviewId },
        data: data.draft
          ? {
              draftFeedback: data.feedback,
              draftScore: data.score ?? null,
              draftRecommendation: data.recommendation ?? null,
            }
          : {
              feedback: data.feedback,
              score: data.score ?? null,
              recommendation: data.recommendation ?? null,
              feedbackSubmittedAt: new Date(),
              feedbackSubmittedById: userId,
              draftFeedback: null,
              draftScore: null,
              draftRecommendation: null,
            },
      });
      if (!data.draft)
        await tx.candidate.update({
          where: { id: interview.candidateId },
          data: {
            interviewFeedback: data.feedback,
            interviewScore: data.score,
          },
        });
      await tx.auditLog.create({
        data: {
          actionPerformed: data.draft
            ? "SAVE_INTERVIEW_FEEDBACK_DRAFT"
            : "SUBMIT_INTERVIEW_FEEDBACK",
          oldValue: JSON.stringify({
            interviewId,
            revisionReason: data.revisionReason,
            feedback: interview.feedback,
            score: interview.score,
            recommendation: interview.recommendation,
          }),
          moduleAffected: "recruitment",
          recordIdAffected: interview.candidateId,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      return updated;
    });
  }

  async screenCandidate(
    id: string,
    data: any,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    await this.assertCandidateAccess(id, userId);
    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) throw new Error("Candidate not found.");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.candidate.update({
        where: { id },
        data: {
          screeningStatus: data.screeningStatus,
          screeningNotes: data.screeningNotes ?? candidate.screeningNotes,
        },
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: "SCREEN_CANDIDATE",
          moduleAffected: "recruitment",
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      return updated;
    });
  }

  async interviewCandidate(
    id: string,
    data: any,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    await this.assertCandidateAccess(id, userId);
    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) throw new Error("Candidate not found.");

    const updated = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT "id" FROM "requisitions" WHERE "id" = ${candidate.requisitionId} FOR UPDATE`;
      const current = await tx.candidate.findUniqueOrThrow({ where: { id } });
      const updated = await tx.candidate.update({
        where: { id },
        data: {
          screeningStatus:
            current.screeningStatus === "SCREENING_PENDING"
              ? "SHORTLISTED"
              : current.screeningStatus,
          interviewRound: data.interviewRound ?? current.interviewRound,
          interviewDate: data.interviewDate
            ? new Date(data.interviewDate)
            : current.interviewDate,
          interviewLocation:
            data.interviewLocation ?? current.interviewLocation,
          interviewFeedback:
            data.interviewFeedback ?? current.interviewFeedback,
          interviewScore: data.interviewScore ?? current.interviewScore,
          selectionStatus: Object.prototype.hasOwnProperty.call(
            data,
            "selectionStatus",
          )
            ? data.selectionStatus
            : current.selectionStatus,
          interviewerId: data.interviewerId ?? current.interviewerId,
        },
      });
      // Legacy callers can still reschedule, but must preserve appointment history.
      if (
        data.interviewDate &&
        new Date(data.interviewDate).getTime() !==
          current.interviewDate?.getTime()
      ) {
        const oldAppointment = await tx.interview.findFirst({
          where: {
            candidateId: id,
            status: "SCHEDULED",
            startsAt: current.interviewDate || undefined,
          },
          orderBy: { startsAt: "desc" },
        });
        const startsAt = new Date(data.interviewDate);
        const endsAt = new Date(
          startsAt.getTime() +
            (oldAppointment
              ? oldAppointment.endsAt.getTime() -
                oldAppointment.startsAt.getTime()
              : 3600000),
        );
        const panel = data.interviewerId ?? current.interviewerId;
        if (panel) {
          await tx.$queryRaw`SELECT "id" FROM "employees" WHERE "id" = ${panel} FOR UPDATE`;
          const conflict = await tx.interview.findFirst({
            where: {
              id: { not: oldAppointment?.id },
              interviewerId: panel,
              status: "SCHEDULED",
              startsAt: { lt: endsAt },
              endsAt: { gt: startsAt },
            },
          });
          if (conflict)
            throw new Error(
              "This interviewer already has an interview during that time.",
            );
        }
        if (oldAppointment)
          await tx.interview.update({
            where: { id: oldAppointment.id },
            data: { status: "CANCELLED" },
          });
        await tx.interview.create({
          data: {
            candidateId: id,
            round:
              data.interviewRound || current.interviewRound || "TELEPHONIC",
            startsAt,
            endsAt,
            mode: oldAppointment?.mode || "IN_PERSON",
            location: data.interviewLocation ?? current.interviewLocation,
            interviewerId: panel,
            createdById: userId,
          },
        });
      }
      await tx.auditLog.create({
        data: {
          actionPerformed: "INTERVIEW_CANDIDATE",
          moduleAffected: "recruitment",
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      await this.closeFilledRequisition(
        tx,
        candidate.requisitionId,
        userId,
        reqContext.ipAddress,
      );
      return updated;
    });
    return updated;
  }

  async offerCandidate(
    id: string,
    data: any,
    userId: string,
    reqContext: { ipAddress?: string } = {},
  ) {
    await this.assertCandidateAccess(id, userId);
    const updated = await prisma.$transaction(async (tx) => {
      const candidate = await tx.candidate.findUnique({ where: { id } });
      if (!candidate) throw new Error("Candidate not found.");
      await tx.$queryRaw`SELECT "id" FROM "requisitions" WHERE "id" = ${candidate.requisitionId} FOR UPDATE`;
      const current = await tx.candidate.findUniqueOrThrow({ where: { id } });
      if (
        ["RELEASED", "OFFER_ACCEPTED", "OFFER_DECLINED"].includes(
          data.offerStatus,
        ) &&
        current.selectionStatus !== "SELECTED" &&
        !["RELEASED", "OFFER_ACCEPTED", "OFFER_DECLINED"].includes(
          current.offerStatus || "",
        )
      ) {
        throw new Error("Select the candidate before creating an offer.");
      }
      if (
        ["OFFER_ACCEPTED", "OFFER_DECLINED"].includes(data.offerStatus) &&
        !["RELEASED", "OFFER_ACCEPTED", "OFFER_DECLINED"].includes(
          current.offerStatus || "",
        )
      )
        throw new Error(
          "Release the offer before recording acceptance or decline.",
        );
      if (
        data.joiningStatus === "JOINED" &&
        (data.offerStatus !== "OFFER_ACCEPTED" || !data.actualJoiningDate)
      )
        throw new Error(
          "An accepted offer and actual joining date are required to mark joined.",
        );
      const updated = await tx.candidate.update({
        where: { id },
        data: {
          screeningStatus: "SHORTLISTED",
          interviewRound:
            data.offerStatus === "NOT_RELEASED"
              ? current.interviewRound
              : "OFFER",
          offerStatus: data.offerStatus,
          offerDate: data.offerDate
            ? new Date(data.offerDate)
            : current.offerDate,
          offeredSalary: data.offeredSalary ?? current.offeredSalary,
          joiningDate: data.joiningDate
            ? new Date(data.joiningDate)
            : current.joiningDate,
          joiningStatus: data.joiningStatus ?? current.joiningStatus,
          selectionStatus:
            data.joiningStatus === "NOT_JOINED"
              ? null
              : current.selectionStatus,
          actualJoiningDate: data.actualJoiningDate
            ? new Date(data.actualJoiningDate)
            : current.actualJoiningDate,
        },
      });
      await tx.auditLog.create({
        data: {
          actionPerformed: "OFFER_CANDIDATE",
          moduleAffected: "recruitment",
          recordIdAffected: id,
          userId,
          ipAddress: reqContext.ipAddress,
        },
      });
      await this.closeFilledRequisition(
        tx,
        candidate.requisitionId,
        userId,
        reqContext.ipAddress,
      );
      return updated;
    });
    return updated;
  }
}

export const recruitmentService = new RecruitmentService();
