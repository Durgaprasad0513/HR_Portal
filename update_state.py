import re

with open("client/src/pages/employees/EmployeeFormPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace formData initialization
old_form_data = """  const [formData, setFormData] = useState({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    departmentId: '',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'PERMANENT',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    managerId: '',
    location: '',
    status: 'ACTIVE',
  });"""

new_form_data = """  const [formData, setFormData] = useState({
    employeeCode: '', firstName: '', lastName: '', email: '', phone: '',
    departmentId: '', designation: '', joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'PERMANENT', dateOfBirth: '', gender: '', address: '',
    city: '', state: '', zipCode: '', country: '', managerId: '',
    location: '', status: 'ACTIVE',
    maritalStatus: '', alternateMobile: '', personalEmail: '', permanentAddress: '',
    emergencyContactName: '', emergencyContactRelation: '', emergencyContactNumber: '',
    grade: '', probationPeriod: '', confirmationDate: '', resignationDate: '',
    noticePeriod: '', lastWorkingDate: '', exitType: '', exitReason: '',
    ctc: '', basicSalary: '', grossSalary: '', bankName: '', bankAccountNumber: '',
    ifscCode: '', pfNumber: '', uanNumber: '', esiNumber: '', panNumber: '', aadhaarNumber: '', statutoryRemarks: ''
  });"""

content = content.replace(old_form_data, new_form_data)

# Replace useEffect population
old_use_effect = """        designation: e.designation,
        joiningDate: new Date(e.joiningDate).toISOString().split('T')[0],
        employmentType: e.employmentType || 'PERMANENT',
        dateOfBirth: e.dateOfBirth ? new Date(e.dateOfBirth).toISOString().split('T')[0] : '',
        gender: e.gender || '',
        address: e.address || '',
        city: e.city || '',
        state: e.state || '',
        zipCode: e.zipCode || '',
        country: e.country || '',
        managerId: e.managerId || '',
        location: e.location || '',
        status: e.status || 'ACTIVE',
      });"""

new_use_effect = """        designation: e.designation,
        joiningDate: new Date(e.joiningDate).toISOString().split('T')[0],
        employmentType: e.employmentType || 'PERMANENT',
        dateOfBirth: e.dateOfBirth ? new Date(e.dateOfBirth).toISOString().split('T')[0] : '',
        gender: e.gender || '',
        address: e.address || '', city: e.city || '', state: e.state || '',
        zipCode: e.zipCode || '', country: e.country || '',
        managerId: e.managerId || '', location: e.location || '', status: e.status || 'ACTIVE',
        maritalStatus: e.maritalStatus || '', alternateMobile: e.alternateMobile || '',
        personalEmail: e.personalEmail || '', permanentAddress: e.permanentAddress || '',
        emergencyContactName: e.emergencyContactName || '', emergencyContactRelation: e.emergencyContactRelation || '',
        emergencyContactNumber: e.emergencyContactNumber || '', grade: e.grade || '',
        probationPeriod: e.probationPeriod?.toString() || '',
        confirmationDate: e.confirmationDate ? new Date(e.confirmationDate).toISOString().split('T')[0] : '',
        resignationDate: e.resignationDate ? new Date(e.resignationDate).toISOString().split('T')[0] : '',
        noticePeriod: e.noticePeriod?.toString() || '',
        lastWorkingDate: e.lastWorkingDate ? new Date(e.lastWorkingDate).toISOString().split('T')[0] : '',
        exitType: e.exitType || '', exitReason: e.exitReason || '',
        ctc: e.ctc?.toString() || '', basicSalary: e.basicSalary?.toString() || '',
        grossSalary: e.grossSalary?.toString() || '', bankName: e.bankName || '',
        bankAccountNumber: e.bankAccountNumber || '', ifscCode: e.ifscCode || '',
        pfNumber: e.pfNumber || '', uanNumber: e.uanNumber || '', esiNumber: e.esiNumber || '',
        panNumber: e.panNumber || '', aadhaarNumber: e.aadhaarNumber || '', statutoryRemarks: e.statutoryRemarks || ''
      });"""

content = content.replace(old_use_effect, new_use_effect)

# Replace handleSubmit payload prep
old_handle_submit = """    const payload = { ...formData };
    if (!payload.managerId) delete (payload as any).managerId;
    if (!payload.dateOfBirth) delete (payload as any).dateOfBirth;
    if (!payload.gender) delete (payload as any).gender;
    if (!payload.location) delete (payload as any).location;
    if (!payload.departmentId) delete (payload as any).departmentId;
    if (!payload.employmentType) delete (payload as any).employmentType;
    if (!payload.status) delete (payload as any).status;
    mutation.mutate(payload);"""

new_handle_submit = """    const payload: any = { ...formData };
    
    // Convert empty strings to undefined to not fail validations
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') {
        delete payload[key];
      }
    });

    // Convert numeric fields
    const numericFields = ['salary', 'probationPeriod', 'noticePeriod', 'ctc', 'basicSalary', 'grossSalary'];
    numericFields.forEach(field => {
      if (payload[field]) {
        payload[field] = Number(payload[field]);
      }
    });
    
    mutation.mutate(payload);"""

content = content.replace(old_handle_submit, new_handle_submit)

with open("client/src/pages/employees/EmployeeFormPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("State updated")
