import re
import os

path = 'server/src/modules/travel/travel.service.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("userId: approverId: approverEmployeeId,", "userId: approverUserId,")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
