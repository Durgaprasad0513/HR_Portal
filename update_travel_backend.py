import re
import os

# 1. travel.schema.ts
with open("server/src/modules/travel/travel.schema.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Fix updateApprovalSchema enum to match DB
content = re.sub(
    r"z\.enum\(\['APPROVAL_APPROVED', 'APPROVAL_REJECTED'\]\)",
    r"z.enum(['APPROVED', 'REJECTED'])",
    content
)

# Add submitExpenseSchema
submit_schema = """
export const submitExpenseSchema = z.object({
  hotelExpense: z.number().min(0),
  foodAllowance: z.number().min(0),
  localConveyance: z.number().min(0),
  otherExpenses: z.number().min(0),
  billUpload: z.string().optional()
});
"""
if "submitExpenseSchema" not in content:
    content += submit_schema

with open("server/src/modules/travel/travel.schema.ts", "w", encoding="utf-8") as f:
    f.write(content)


# 2. travel.routes.ts
with open("server/src/modules/travel/travel.routes.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "createTravelSchema, updateApprovalSchema, updateSettlementSchema } from './travel.schema';",
    "createTravelSchema, updateApprovalSchema, updateSettlementSchema, submitExpenseSchema } from './travel.schema';"
)
if "/:id/expenses" not in content:
    expense_route = "router.put('/:id/expenses', validateRequest({ body: submitExpenseSchema }), (req, res) => travelController.submitExpenses(req, res));\n"
    content = content.replace("export default router;", expense_route + "export default router;")

with open("server/src/modules/travel/travel.routes.ts", "w", encoding="utf-8") as f:
    f.write(content)


# 3. travel.controller.ts
with open("server/src/modules/travel/travel.controller.ts", "r", encoding="utf-8") as f:
    content = f.read()

submit_expense_func = """
  async submitExpenses(req: Request, res: Response) {
    try {
      const data = await this.travelService.submitExpenses(req.user, req.params.id, req.body, { ipAddress: req.ip });
      res.json({ success: true, data, message: 'Expenses submitted successfully' });
    } catch (error: any) {
      res.status(403).json({ success: false, message: error.message });
    }
  }
"""
if "submitExpenses(" not in content:
    content = content.replace("async updateSettlement(", submit_expense_func + "\n  async updateSettlement(")

with open("server/src/modules/travel/travel.controller.ts", "w", encoding="utf-8") as f:
    f.write(content)


# 4. travel.service.ts
with open("server/src/modules/travel/travel.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Fix updateApproval logic (was using status enum directly without mapping from 'APPROVED' -> 'APPROVAL_APPROVED' maybe?)
# Let's just fix the DB update to map properly or if Prisma enum is actually APPROVAL_PENDING... wait!
# Prisma schema for TravelRequest says:
#   approvalStatus ApprovalStatus @default(APPROVAL_PENDING)
# ApprovalStatus enum has: APPROVAL_PENDING, APPROVAL_APPROVED, APPROVAL_REJECTED.
# So if frontend sends 'APPROVED', we need to map to 'APPROVAL_APPROVED'.

service_fixes = """
  async updateApprovalStatus(currentUser: CurrentUser, id: string, data: any, reqContext: { ipAddress?: string } = {}) {
    const scope = getModuleScope(currentUser.role, 'travel');
    if (scope !== 'ORG') throw new Error('Not authorized');

    const mappedStatus = data.approvalStatus === 'APPROVED' ? 'APPROVAL_APPROVED' : 'APPROVAL_REJECTED';
    
    const request = await prisma.$transaction(async (tx) => {
      return tx.travelRequest.update({
        where: { id },
        data: {
          approvalStatus: mappedStatus,
          approvalDate: new Date(),
          advanceApproved: data.advanceApproved
        }
      });
    });
    return request;
  }

  async submitExpenses(currentUser: CurrentUser, id: string, data: any, reqContext: { ipAddress?: string } = {}) {
    const existing = await prisma.travelRequest.findUnique({ where: { id } });
    if (!existing) throw new Error('Request not found');
    
    // Employee self-service
    if (existing.employeeId !== currentUser.employeeId) {
      throw new Error('Not authorized to submit expenses for this request');
    }

    if (existing.approvalStatus !== 'APPROVAL_APPROVED') {
      throw new Error('Cannot submit expenses for an unapproved request');
    }

    const totalClaimed = (data.hotelExpense || 0) + (data.foodAllowance || 0) + (data.localConveyance || 0) + (data.otherExpenses || 0);

    const request = await prisma.$transaction(async (tx) => {
      return tx.travelRequest.update({
        where: { id },
        data: {
          hotelExpense: data.hotelExpense,
          foodAllowance: data.foodAllowance,
          localConveyance: data.localConveyance,
          otherExpenses: data.otherExpenses,
          totalExpenseClaimed: totalClaimed,
          billUpload: data.billUpload,
          settlementStatus: 'SUBMITTED'
        }
      });
    });
    return request;
  }

  async updateSettlement(currentUser: CurrentUser, id: string, data: any, reqContext: { ipAddress?: string } = {}) {
    const scope = getModuleScope(currentUser.role, 'travel');
    if (scope !== 'ORG') throw new Error('Not authorized');

    const existing = await prisma.travelRequest.findUnique({ where: { id } });
    if (!existing) throw new Error('Request not found');

    const totalClaimed = Number(existing.totalExpenseClaimed || 0);
    const advanceApproved = Number(existing.advanceApproved || 0);
    const amountPayable = totalClaimed - advanceApproved;

    const request = await prisma.$transaction(async (tx) => {
      return tx.travelRequest.update({
        where: { id },
        data: {
          settlementStatus: 'SETTLED',
          amountPayable: amountPayable,
          settlementDate: new Date()
        }
      });
    });
    return request;
  }
"""
# Replace the existing methods with our new implementations
content = re.sub(r"async updateApprovalStatus.*?(?=async updateSettlement)", "", content, flags=re.DOTALL)
content = re.sub(r"async updateSettlement.*?(?=\n})", service_fixes, content, flags=re.DOTALL)

with open("server/src/modules/travel/travel.service.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated backend travel code successfully")
