import re

with open("server/src/modules/assets/asset.service.ts", "r", encoding="utf-8") as f:
    content = f.read()

target = """    const asset = await prisma.$transaction(async (tx) => {
      return tx.asset.update({
        where: { id },
        data: {
          assignedEmployeeId: null,
          returnDate: data.returnDate ?? new Date(),
          returnCondition: data.returnCondition,
          status: AssetStatus.RETURNED
        }
      });
    });"""

replacement = """    const newStatus = isEditor ? AssetStatus.RETURNED : AssetStatus.RETURN_REQUESTED;
    const newAssignedId = isEditor ? null : existing.assignedEmployeeId;
    const newReturnDate = isEditor ? (data.returnDate ?? new Date()) : existing.returnDate;

    const asset = await prisma.$transaction(async (tx) => {
      return tx.asset.update({
        where: { id },
        data: {
          assignedEmployeeId: newAssignedId,
          returnDate: newReturnDate,
          returnCondition: data.returnCondition,
          status: newStatus
        }
      });
    });"""

if target in content:
    content = content.replace(target, replacement)
    with open("server/src/modules/assets/asset.service.ts", "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found")
