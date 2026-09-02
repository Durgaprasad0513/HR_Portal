import re
import os

path = "server/tests/gate1.test.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("expect(res.status).toBe(200);", "if(res.status !== 200) console.log(res.body); expect(res.status).toBe(200);")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
