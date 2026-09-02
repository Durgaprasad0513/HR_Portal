import re

with open("client/src/pages/employees/EmployeeFormPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add Payroll & HR Information card before Documents
payroll_card = """        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payroll & HR Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="CTC (Annual)" type="number" name="ctc" value={formData.ctc} onChange={handleChange} />
              <Input label="Basic Salary" type="number" name="basicSalary" value={formData.basicSalary} onChange={handleChange} />
              <Input label="Gross Salary" type="number" name="grossSalary" value={formData.grossSalary} onChange={handleChange} />
              
              <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
              <Input label="Account Number" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} />
              <Input label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
              
              <Input label="PF Number" name="pfNumber" value={formData.pfNumber} onChange={handleChange} />
              <Input label="UAN Number" name="uanNumber" value={formData.uanNumber} onChange={handleChange} />
              <Input label="ESI Number" name="esiNumber" value={formData.esiNumber} onChange={handleChange} />
              <Input label="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange} />
              <Input label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} />
              
              <div className="md:col-span-3">
                <Input label="Statutory Remarks" name="statutoryRemarks" value={formData.statutoryRemarks} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Documents & Certificates</CardTitle>"""

content = content.replace("""        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Documents & Certificates</CardTitle>""", payroll_card)

# Inject into Job details
job_extras = """              <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} required />
              <Input label="Joining Date" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
              
              <Input label="Confirmation Date" type="date" name="confirmationDate" value={formData.confirmationDate} onChange={handleChange} />
              <Input label="Last Working Date" type="date" name="lastWorkingDate" value={formData.lastWorkingDate} onChange={handleChange} />
              <Input label="Resignation Date" type="date" name="resignationDate" value={formData.resignationDate} onChange={handleChange} />
              <Input label="Probation Period (Days)" type="number" name="probationPeriod" value={formData.probationPeriod} onChange={handleChange} />
              <Input label="Notice Period (Days)" type="number" name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} />
              
              <div className="flex flex-col space-y-1 w-full">"""

content = content.replace("""              <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} required />
              <Input label="Joining Date" type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
              
              <div className="flex flex-col space-y-1 w-full">""", job_extras)

# Inject into Personal info
personal_extras = """              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="Alternate Mobile" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange} />
              <Input label="Personal Email" type="email" name="personalEmail" value={formData.personalEmail} onChange={handleChange} />
              
              <Input label="Emergency Contact Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />
              <Input label="Emergency Contact Number" name="emergencyContactNumber" value={formData.emergencyContactNumber} onChange={handleChange} />
              <Input label="Emergency Contact Relation" name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} />

              <Input label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />"""

content = content.replace("""              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              <Input label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />""", personal_extras)

with open("client/src/pages/employees/EmployeeFormPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("JSX updated")
