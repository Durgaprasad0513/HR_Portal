import re

with open('client/src/pages/employees/EmployeeDetailPage.tsx', 'r') as f:
    content = f.read()

# Add ConfirmDialog import
if 'ConfirmDialog' not in content:
    content = re.sub(r"import \{ Button \} from '@/components/ui/Button';", "import { Button } from '@/components/ui/Button';\nimport { ConfirmDialog } from '@/components/ui/ConfirmDialog';", content)

# Add API import
if 'employeesApi' not in content:
    content = re.sub(r"import \{ useQuery \} from '@tanstack/react-query';", "import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';\nimport { employeesApi } from '@/api/employees';", content)

# Add state
if 'isDeactivateOpen' not in content:
    content = re.sub(r'(const { id } = useParams\(\);)', r'\1\n  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);\n  const queryClient = useQueryClient();\n\n  const deactivateMutation = useMutation({\n    mutationFn: (empId: string) => employeesApi.delete(empId),\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ["employees"] });\n      navigate("/employees");\n    }\n  });', content)

# Add Deactivate button to action bar
if 'Deactivate' not in content:
    content = re.sub(r'(<Button>Edit Profile</Button>)', r'\1\n          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setIsDeactivateOpen(true)}>Deactivate</Button>', content)

# Add ConfirmDialog at the end of the container
if '<ConfirmDialog' not in content:
    content = re.sub(r'(</div>\n    </div>\n  \);\n\})', r'  <ConfirmDialog isOpen={isDeactivateOpen} title="Deactivate Employee" message="Are you sure you want to deactivate this employee? They will lose access to the system immediately." confirmLabel="Deactivate" cancelLabel="Cancel" isDestructive={true} onConfirm={() => deactivateMutation.mutate(id as string)} onCancel={() => setIsDeactivateOpen(false)} />\n\1', content)

with open('client/src/pages/employees/EmployeeDetailPage.tsx', 'w') as f:
    f.write(content)
print('Done!')
