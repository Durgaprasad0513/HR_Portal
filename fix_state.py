import re

with open("client/src/pages/employees/EmployeeFormPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_state = "const [pendingFiles, setPendingFiles] = useState<File[]>([]);"
new_state = "const [pendingFiles, setPendingFiles] = useState<File[]>([]);\n  const [credentialsModal, setCredentialsModal] = useState<{email: string, password: string} | null>(null);"

content = content.replace(old_state, new_state)

with open("client/src/pages/employees/EmployeeFormPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Injected credentialsModal state")
