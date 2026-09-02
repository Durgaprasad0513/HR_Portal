import re
import os

def replace_in_file(path, old, new):
    if not os.path.exists(path): return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.replace(old, new))

# 1. Update Travel Controller to pass req.user!.employeeId! instead of req.user!.userId
replace_in_file('server/src/modules/travel/travel.controller.ts',
                "await travelService.updateApprovalStatus(req.params.id as string, req.body, req.user!.userId, { ipAddress: req.ip });",
                "await travelService.updateApprovalStatus(req.params.id as string, req.body, req.user!.employeeId!, req.user!.userId, { ipAddress: req.ip });")

# 2. Update Travel Service to accept both approverEmployeeId and approverUserId
replace_in_file('server/src/modules/travel/travel.service.ts',
                "async updateApprovalStatus(id: string, data: any, approverId: string, reqContext: { ipAddress?: string } = {}) {",
                "async updateApprovalStatus(id: string, data: any, approverEmployeeId: string, approverUserId: string, reqContext: { ipAddress?: string } = {}) {")

replace_in_file('server/src/modules/travel/travel.service.ts',
                "approverId,",
                "approverId: approverEmployeeId,")

replace_in_file('server/src/modules/travel/travel.service.ts',
                "userId: approverId,",
                "userId: approverUserId,")
