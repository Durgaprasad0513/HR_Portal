import re

with open("client/src/pages/employees/EmployeeFormPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

inputs_to_require = [
    'name="phone"',
    'name="dateOfBirth"',
    'name="address"',
    'name="city"',
    'name="state"',
    'name="zipCode"',
    'name="country"',
    'name="emergencyContactName"',
    'name="emergencyContactNumber"'
]

for attr in inputs_to_require:
    content = re.sub(
        r'(<Input[^>]*?' + re.escape(attr) + r'[^>]*?)(?<!required )/>',
        r'\1 required />',
        content
    )

selects_to_require = [
    'name="gender"',
    'name="departmentId"'
]

for attr in selects_to_require:
    content = re.sub(
        r'(<select\s+name="' + attr.split('"')[1] + r'")(?!\s*required)',
        r'\1 required',
        content
    )

with open("client/src/pages/employees/EmployeeFormPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated successfully")
