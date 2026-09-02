import re
import os

def fix_params(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace("req.params.id,", "req.params.id as string,")
    content = content.replace("req.params.employeeId,", "req.params.employeeId as string,")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_params('server/src/modules/performance/performance.controller.ts')
fix_params('server/src/modules/training/training.controller.ts')
