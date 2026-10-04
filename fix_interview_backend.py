import re

with open('server/src/modules/recruitment/recruitment.service.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_method = """  async getAllInterviews(currentUser: CurrentUser) {
    const scope = getModuleScope(currentUser.role as Role, 'recruitment');
    
    const whereClause: any = {
      interviewDate: { not: null }
    };

    if (scope === 'SELF') {
      whereClause.requisition = { raisedById: currentUser.employeeId };
    } else if (scope === 'TEAM') {
      const emp = await prisma.employee.findUnique({ where: { id: currentUser.employeeId! }, select: { departmentId: true } });
      whereClause.requisition = { departmentId: emp?.departmentId };
    }

    return prisma.candidate.findMany({
      where: whereClause,
      include: {
        requisition: { select: { title: true, position: true } },
        interviewer: { select: { firstName: true, lastName: true } }
      },
      orderBy: { interviewDate: 'asc' }
    });
  }
"""

# Insert it before getCandidatesByRequisition
content = content.replace(
    '  async getCandidatesByRequisition(requisitionId: string, currentUser: CurrentUser) {',
    new_method + '\n  async getCandidatesByRequisition(requisitionId: string, currentUser: CurrentUser) {'
)

with open('server/src/modules/recruitment/recruitment.service.ts', 'w', encoding='utf-8') as f:
    f.write(content)


with open('server/src/modules/recruitment/recruitment.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_controller_method = """  async getAllInterviews(req: Request, res: Response) {
    try {
      const data = await this.service.getAllInterviews(req.user as any);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
"""

content = content.replace(
    '  async getCandidatesByRequisition(req: Request, res: Response) {',
    new_controller_method + '\n  async getCandidatesByRequisition(req: Request, res: Response) {'
)

with open('server/src/modules/recruitment/recruitment.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)


with open('server/src/modules/recruitment/recruitment.routes.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '// Candidates\nrouter.post(\'/candidates\',',
    '// Interviews\nrouter.get(\'/interviews\', requirePermission(\'recruitment\', \'view\'), (req, res) => recruitmentController.getAllInterviews(req, res));\n\n// Candidates\nrouter.post(\'/candidates\','
)

with open('server/src/modules/recruitment/recruitment.routes.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated backend API for interviews")
