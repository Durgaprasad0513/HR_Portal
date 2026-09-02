import re
import os

path = "server/tests/gate2.test.ts"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("employeeToken = resEmp.body.data.token;", """if(resEmp.status !== 200) console.log('EMP LOGIN FAIL', resEmp.body);
    employeeToken = resEmp.body.data.token;""")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
