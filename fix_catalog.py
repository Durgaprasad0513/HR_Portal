import re
import os

path = "server/src/modules/permissions/permission.catalog.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("performance: view(),", "performance: { ...none, canView: true, canEdit: true },")
content = content.replace("training: view(),", "training: { ...none, canView: true, canEdit: true },")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
