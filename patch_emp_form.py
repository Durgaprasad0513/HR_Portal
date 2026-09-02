import re

with open("client/src/pages/employees/EmployeeFormPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add useState for credentials modal if not exists
if "const [credentialsModal, setCredentialsModal] = useState" not in content:
    content = content.replace("const [isUploading, setIsUploading] = useState(false);", "const [isUploading, setIsUploading] = useState(false);\n  const [credentialsModal, setCredentialsModal] = useState<{email: string, password: string} | null>(null);")

# Update onSuccess logic
old_onSuccess = """    onSuccess: async (res) => {
      if (!isEdit && pendingFiles.length > 0 && res?.data?.id) {
        try {
          await Promise.all(pendingFiles.map(file => {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('documentType', 'EDUCATIONAL_CERTIFICATE');
            fd.append('documentName', file.name);
            fd.append('employeeId', res.data.id);
            return employeesApi.uploadDocument(fd);
          }));
        } catch (e) {
          toast.error('Employee created but some document uploads failed');
        }
      }
      toast.success(`Employee ${isEdit ? 'updated' : 'created'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/employees');
    },"""

new_onSuccess = """    onSuccess: async (res) => {
      // Handle the new response format for creation
      const employeeObj = !isEdit && res?.data?.employee ? res.data.employee : res?.data;
      const empId = employeeObj?.id;
      
      if (!isEdit && pendingFiles.length > 0 && empId) {
        try {
          await Promise.all(pendingFiles.map(file => {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('documentType', 'EDUCATIONAL_CERTIFICATE');
            fd.append('documentName', file.name);
            fd.append('employeeId', empId);
            return employeesApi.uploadDocument(fd);
          }));
        } catch (e) {
          toast.error('Employee created but some document uploads failed');
        }
      }
      
      toast.success(`Employee ${isEdit ? 'updated' : 'created'} successfully`);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      
      if (!isEdit && res?.data?.temporaryPassword) {
        // Show credentials modal instead of navigating immediately
        setCredentialsModal({
          email: employeeObj.email,
          password: res.data.temporaryPassword
        });
      } else {
        navigate('/employees');
      }
    },"""

content = content.replace(old_onSuccess, new_onSuccess)

# Add Modal import and JSX
if "import { Modal } from '@/components/ui/Modal';" not in content:
    content = content.replace("import { Button } from '@/components/ui/Button';", "import { Button } from '@/components/ui/Button';\nimport { Modal } from '@/components/ui/Modal';\nimport { KeyRound, Copy } from 'lucide-react';")
    
modal_jsx = """
      {/* Credentials Modal */}
      {credentialsModal && (
        <Modal 
          isOpen={!!credentialsModal} 
          onClose={() => {
            setCredentialsModal(null);
            navigate('/employees');
          }} 
          title="User Account Created"
        >
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A login account has been automatically created for this employee. Please share these credentials securely.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                <p className="font-mono text-sm font-semibold">{credentialsModal.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-medium">Temporary Password</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <p className="font-mono text-lg font-bold text-primary-600 tracking-wider">{credentialsModal.password}</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(credentialsModal.password);
                      toast.success('Password copied to clipboard');
                    }}
                    className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button onClick={() => {
                setCredentialsModal(null);
                navigate('/employees');
              }} className="w-full">
                I've saved these credentials
              </Button>
            </div>
          </div>
        </Modal>
      )}"""

# Insert modal at the end of the return statement
content = content.replace("    </div>\n  );\n}", modal_jsx + "\n    </div>\n  );\n}")

with open("client/src/pages/employees/EmployeeFormPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Patched EmployeeFormPage.tsx")
