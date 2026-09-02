import re

with open("client/src/pages/employees/EmployeeDetailPage.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip_sections = False
for line in lines:
    if line.startswith("const SECTIONS = ["):
        skip_sections = True
    if skip_sections and line.startswith("];"):
        skip_sections = False
        continue
    if not skip_sections:
        new_lines.append(line)

content = "".join(new_lines)

useauth_old = "  const { user } = useAuth();"
useauth_new = """  const { user } = useAuth();
  const isHR = user?.role === 'ADMIN' || user?.role === 'HR' || user?.role === 'REMOVED_ROLE';
  
  const SECTIONS = [
    { id: 'general', label: 'Personal Information' },
    { id: 'job', label: 'Employment Information' },
    ...(isHR ? [{ id: 'payroll', label: 'Payroll & HR Information' }] : []),
    { id: 'education', label: 'Documents' },
  ];"""
content = content.replace(useauth_old, useauth_new)

header_old = """<div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-lg ring-2 ring-white shadow-sm">
              {emp.firstName[0]}{emp.lastName[0]}
            </div>"""
header_new = """{emp.profilePhoto ? (
              <img src={emp.profilePhoto} alt="Profile" className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-lg ring-2 ring-white shadow-sm">
                {emp.firstName[0]}{emp.lastName[0]}
              </div>
            )}"""
content = content.replace(header_old, header_new)

main_content_replacement = """          <div className="lg:col-span-3 space-y-8 pb-32">
            
            {/* General Information */}
            <section id="general" className="space-y-6 scroll-mt-24">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy-900 dark:text-white">Personal Information</h2>
              </div>
              
              <Card>
                <CardHeader><CardTitle className="text-base">Basic Details</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Employee ID</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.employeeCode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">First Name</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.firstName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Name</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.lastName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date of Birth</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gender</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Mobile Number</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-base">Address & Emergency Contact</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Full Address</p>
                      <p className="font-medium text-navy-900 dark:text-white">
                        {[emp.address, emp.city, emp.state, emp.zipCode, emp.country].filter(bool).join(', ') or 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Emergency Contact Name</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.emergencyContactName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Emergency Contact Number</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.emergencyContactNumber || 'N/A'} {emp.emergencyContactRelation ? () : ''}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Employment Information */}
            <section id="job" className="space-y-6 scroll-mt-24">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy-900 dark:text-white">Employment Information</h2>
              </div>
  
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Department</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.department?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Designation</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.designation || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location / Plant</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date of Joining</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reporting Manager</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.manager ? ${emp.manager.firstName}  : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Employment Type</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.employmentType ? emp.employmentType.replace('_', ' ') : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Employee Status</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.status || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Confirmation Date</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.confirmationDate ? new Date(emp.confirmationDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Working Date</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.lastWorkingDate ? new Date(emp.lastWorkingDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    {emp.resignationDate && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resignation Date</p>
                        <p className="font-medium text-navy-900 dark:text-white">{new Date(emp.resignationDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Payroll / HR Information */}
            {isHR && (
            <section id="payroll" className="space-y-6 scroll-mt-24">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy-900 dark:text-white">Payroll & HR Information</h2>
              </div>
  
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-8">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">CTC (Annual)</p>
                      <p className="font-medium text-navy-900 dark:text-white">₹{emp.ctc ? emp.ctc.toLocaleString() : '0'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Basic Salary</p>
                      <p className="font-medium text-navy-900 dark:text-white">₹{emp.basicSalary ? emp.basicSalary.toLocaleString() : '0'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gross Salary</p>
                      <p className="font-medium text-navy-900 dark:text-white">₹{emp.grossSalary ? emp.grossSalary.toLocaleString() : '0'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bank Name</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.bankName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Account Number</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.bankAccountNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">IFSC Code</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.ifscCode || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PF Number</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.pfNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">UAN Number</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.uanNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ESI Number</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.esiNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">PAN Number</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.panNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Aadhaar Number</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.aadhaarNumber || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Statutory Remarks / Other Info</p>
                      <p className="font-medium text-navy-900 dark:text-white">{emp.statutoryRemarks || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            )}

            <section id="education" className="space-y-6 scroll-mt-24">
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">Documents</h2>
              <Card>
                <CardContent className="pt-6">
                  {emp.documents && emp.documents.length > 0 ? (
                    <div className="space-y-4">
                      {emp.documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-start gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-lg">
                          <div className="bg-blue-50 p-3 rounded-lg"><FileText className="text-blue-500 w-6 h-6" /></div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-navy-900 dark:text-white">{doc.documentName}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{doc.documentType.replace('_', ' ')} • Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}</p>
                            <div className="mt-2 flex items-center gap-2 text-sm text-accent-500 font-medium cursor-pointer">
                              <CheckCircle2 className="w-4 h-4" /> {doc.verificationStatus === 'VERIFIED' ? 'Verified' : 'Pending Verification'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded yet (e.g., Resume, Aadhaar, PAN, Certificates, Appointment Letter).</p>
                  )}
                </CardContent>
              </Card>
            </section>

          </div>\n"""

# Need to replace python's string filter(bool) back to JS filter(Boolean)
main_content_replacement = main_content_replacement.replace("filter(bool)", "filter(Boolean)")

# Find the start and end indices of the main content block to replace
start_idx = content.find('<div className="lg:col-span-3 space-y-8 pb-32">')
end_idx = content.find('        {/* Right Sticky Navigation */}')

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + main_content_replacement + content[end_idx:]

with open("client/src/pages/employees/EmployeeDetailPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied.")
