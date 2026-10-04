import re

with open('server/src/modules/recruitment/recruitment.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'requisition: { select: { title: true, position: true } },',
    'requisition: { select: { positionTitle: true } },'
)

with open('server/src/modules/recruitment/recruitment.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('server/src/modules/recruitment/recruitment.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_controller_method = """  async getAllInterviews(req: AuthRequest, res: Response) {
    try {
      const data = await recruitmentService.getAllInterviews(req.user!);
      return sendSuccess(res, data, 'Interviews retrieved successfully');
    } catch (error: any) {
      return sendError(res, error.message, 400);
    }
  }
"""

# Try to insert it before getCandidatesByRequisition
content = re.sub(
    r'(  async getCandidatesByRequisition\(req: AuthRequest, res: Response\) {)',
    new_controller_method + r'\n\1',
    content
)

with open('server/src/modules/recruitment/recruitment.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()
# update the client UI to use cand.requisition?.positionTitle
content = content.replace(
    'cand.requisition?.title',
    'cand.requisition?.positionTitle'
)

with open('client/src/pages/recruitment/InterviewCalendarPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated backend 2")
