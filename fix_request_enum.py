import re

def replace_in_file(path, old, new):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.replace(old, new))

replace_in_file('server/src/modules/requests/request.schema.ts', 
  "['LEAVE', 'EQUIPMENT', 'PAYROLL', 'OTHER']", 
  "['LEAVE_QUERY', 'SALARY_QUERY', 'DOCUMENT_REQUEST', 'EXPERIENCE_LETTER', 'PAYSLIP']")

replace_in_file('server/tests/gate1.test.ts', 
  "requestType: 'EQUIPMENT'", 
  "requestType: 'LEAVE_QUERY'")
