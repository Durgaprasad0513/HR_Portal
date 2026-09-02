import re
import os

path = "server/tests/gate2.test.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("expect(settleRes.status).toBe(200);", "if(settleRes.status !== 200) console.log('settle', settleRes.body); expect(settleRes.status).toBe(200);")
content = content.replace("expect(createRes.status).toBe(200);", "if(createRes.status !== 200) console.log('create asset', createRes.body); expect(createRes.status).toBe(200);")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
