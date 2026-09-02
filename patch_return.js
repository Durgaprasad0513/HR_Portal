const fs = require('fs');

let content = fs.readFileSync('server/src/modules/assets/asset.service.ts', 'utf8');

const target = `    const asset = await prisma.$transaction(async (tx) => {
      return tx.asset.update({
        where: { id },
        data: {
          assignedEmployeeId: null,
          returnDate: data.returnDate ?? new Date(),
          returnCondition: data.returnCondition,
          status: AssetStatus.RETURNED
        }
      });
    });`;

const replacement = `    const newStatus = isEditor ? 'RETURNED' : 'RETURN_REQUESTED';
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
    });`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('server/src/modules/assets/asset.service.ts', content);
    console.log('Replaced successfully');
} else {
    console.log('Target not found');
}
