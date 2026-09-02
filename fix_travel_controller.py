import re

with open("server/src/modules/travel/travel.controller.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Fix updateApprovalStatus
content = content.replace(
    "await travelService.updateApprovalStatus(req.params.id as string, req.body, req.user!.employeeId!, req.user!.userId, { ipAddress: req.ip });",
    "await travelService.updateApprovalStatus(req.user!, req.params.id as string, req.body, { ipAddress: req.ip });"
)

# Fix submitExpenses
content = content.replace(
    "await this.travelService.submitExpenses(req.user, req.params.id, req.body, { ipAddress: req.ip });",
    "await travelService.submitExpenses(req.user!, req.params.id, req.body, { ipAddress: req.ip });"
)

# Fix updateSettlement
content = content.replace(
    "await travelService.updateSettlement(req.params.id as string, req.body, req.user!.userId, { ipAddress: req.ip });",
    "await travelService.updateSettlement(req.user!, req.params.id as string, req.body, { ipAddress: req.ip });"
)

with open("server/src/modules/travel/travel.controller.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed travel controller arguments")
