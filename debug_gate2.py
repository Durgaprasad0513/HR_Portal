import re
import os

path = "server/tests/gate2.test.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("expect(approveRes.status).toBe(200);", "if(approveRes.status !== 200) console.log('approve', approveRes.body); expect(approveRes.status).toBe(200);")
content = content.replace("expect(assignRes.status).toBe(200);", "if(assignRes.status !== 200) console.log('assign', assignRes.body); expect(assignRes.status).toBe(200);")
content = content.replace("expect(returnRes.status).toBe(200);", "if(returnRes.status !== 200) console.log('return', returnRes.body); expect(returnRes.status).toBe(200);")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
