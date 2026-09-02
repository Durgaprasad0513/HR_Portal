import re

with open("server/src/modules/recruitment/recruitment.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Add import
if "import { notificationService }" not in content:
    content = content.replace("import prisma from '../../config/database';", "import prisma from '../../config/database';\nimport { notificationService } from '../notifications/notification.service';")

# 1. interviewCandidate hook
interview_old = """        await tx.auditLog.create({
          data: {
            actionPerformed: 'INTERVIEW_CANDIDATE',
            moduleAffected: 'recruitment',
            recordIdAffected: updated.id,
            userId,
            ipAddress: reqContext.ipAddress,
          }
        });

        return updated;"""

interview_new = """        await tx.auditLog.create({
          data: {
            actionPerformed: 'INTERVIEW_CANDIDATE',
            moduleAffected: 'recruitment',
            recordIdAffected: updated.id,
            userId,
            ipAddress: reqContext.ipAddress,
          }
        });

        if (data.selectionStatus === 'SELECTED') {
          await notificationService.notifyHRs({
            notificationType: 'OFFER',
            message: `Candidate ${candidate.candidateName} has been selected.`,
            triggerEvent: candidate.id
          });
        } else if (data.interviewDate && candidate.interviewDate && new Date(data.interviewDate).getTime() !== candidate.interviewDate.getTime()) {
          await notificationService.notifyHRs({
            notificationType: 'INTERVIEW',
            message: `Interview postponed/rescheduled for ${candidate.candidateName}.`,
            triggerEvent: candidate.id
          });
        } else if (data.interviewDate && !candidate.interviewDate) {
          await notificationService.notifyHRs({
            notificationType: 'INTERVIEW',
            message: `Interview scheduled for ${candidate.candidateName}.`,
            triggerEvent: candidate.id
          });
        }

        return updated;"""

content = content.replace(interview_old, interview_new)

# 2. offerCandidate hook
offer_old = """        await tx.auditLog.create({
          data: {
            actionPerformed: 'OFFER_CANDIDATE',
            moduleAffected: 'recruitment',
            recordIdAffected: updated.id,
            userId,
            ipAddress: reqContext.ipAddress,
          }
        });

        return updated;"""

offer_new = """        await tx.auditLog.create({
          data: {
            actionPerformed: 'OFFER_CANDIDATE',
            moduleAffected: 'recruitment',
            recordIdAffected: updated.id,
            userId,
            ipAddress: reqContext.ipAddress,
          }
        });

        if (data.offerStatus === 'RELEASED') {
          await notificationService.notifyHRs({
            notificationType: 'OFFER',
            message: `Offer released for ${candidate.candidateName}.`,
            triggerEvent: candidate.id
          });
        }

        return updated;"""

content = content.replace(offer_old, offer_new)

with open("server/src/modules/recruitment/recruitment.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated recruitment.service.ts")
