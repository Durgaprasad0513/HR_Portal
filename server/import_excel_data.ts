import { PrismaClient, Gender, MaritalStatus, EmploymentType } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function mapGender(gender: string | null): Gender | undefined {
  if (!gender) return undefined;
  const g = gender.toLowerCase();
  if (g.includes('fe')) return Gender.FEMALE;
  if (g.includes('ma')) return Gender.MALE;
  return Gender.OTHER;
}

function mapMaritalStatus(status: string | null): MaritalStatus | undefined {
  if (!status) return undefined;
  const s = status.toLowerCase();
  if (s.includes('sing')) return MaritalStatus.SINGLE;
  if (s.includes('marr')) return MaritalStatus.MARRIED;
  if (s.includes('divo')) return MaritalStatus.DIVORCED;
  if (s.includes('wid')) return MaritalStatus.WIDOWED;
  return undefined;
}

async function main() {
  const jsonPath = path.join(__dirname, '../import_employees.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log(`Starting import of ${data.length} employees...`);

  for (const row of data) {
    // 1. Ensure Department exists
    const deptName = row['DepartmentName'] || 'Unassigned';
    const dept = await prisma.department.upsert({
      where: { name: deptName },
      update: {},
      create: { name: deptName, description: `${deptName} Department` }
    });

    // 2. Parse Name
    const fullName = row['EmployeeName'] || 'Unknown Employee';
    const parts = fullName.trim().split(' ');
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : ' ';

    // 3. Employee Code
    const empCode = row['EmployeeCode'] ? String(row['EmployeeCode']) : (row['EmployeeId'] ? String(row['EmployeeId']) : `EMP-${Math.floor(Math.random()*10000)}`);

    // 4. Email
    let email = row['Email'] || row['EmailId'];
    if (!email || String(email).trim() === '') {
      email = `${firstName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${lastName.toLowerCase().replace(/[^a-z0-9]/g, '')}@hrms.com`;
    }

    // Ensure email uniqueness fallback
    let existingEmpByEmail = await prisma.employee.findUnique({ where: { email } });
    if (existingEmpByEmail && existingEmpByEmail.employeeCode !== empCode) {
       email = `${firstName.toLowerCase()}${Math.floor(Math.random()*1000)}@hrms.com`;
    }

    try {
      await prisma.employee.upsert({
        where: { employeeCode: empCode },
        update: {
          departmentId: dept.id,
          firstName,
          lastName,
          designation: row['DesignationName'] || 'Employee',
          joiningDate: row['DateofJoining'] ? new Date(row['DateofJoining']) : new Date(),
          gender: mapGender(row['Gender']),
          phone: row['ContactNo'] ? String(row['ContactNo']) : undefined,
          alternateMobile: row['AlternateContactNo'] ? String(row['AlternateContactNo']) : undefined,
          dateOfBirth: row['DateofBirth'] ? new Date(row['DateofBirth']) : undefined,
          address: row['PresentAddress'] ? String(row['PresentAddress']) : undefined,
          permanentAddress: row['PermanentAddress'] ? String(row['PermanentAddress']) : undefined,
          maritalStatus: mapMaritalStatus(row['MaritalStatus']),
          qualification: row['Qualification'] ? String(row['Qualification']) : undefined,
          experience: row['TotalExperience'] ? String(row['TotalExperience']) : (row['In_HouseExperience'] ? String(row['In_HouseExperience']) : undefined),
          emergencyContactName: row['Guardian Name'] ? String(row['Guardian Name']) : undefined,
          emergencyContactRelation: row['TypeOfRelation'] ? String(row['TypeOfRelation']) : undefined,
          location: row['BaseLocation'] ? String(row['BaseLocation']) : undefined,
          bankName: row['BankName'] ? String(row['BankName']) : undefined,
          bankAccountNumber: row['AccountNo'] ? String(row['AccountNo']) : undefined,
          ifscCode: row['IFSCode'] ? String(row['IFSCode']) : undefined,
          pfNumber: row['ProvidentFundNo'] ? String(row['ProvidentFundNo']) : undefined,
          uanNumber: row['UANNo'] ? String(row['UANNo']) : undefined,
          esiNumber: row['ESINo'] ? String(row['ESINo']) : undefined,
          panNumber: row['PANNo'] ? String(row['PANNo']) : undefined,
          aadhaarNumber: row['AadharNumber'] ? String(row['AadharNumber']) : undefined,
        },
        create: {
          employeeCode: empCode,
          email: email,
          departmentId: dept.id,
          firstName,
          lastName,
          designation: row['DesignationName'] || 'Employee',
          joiningDate: row['DateofJoining'] ? new Date(row['DateofJoining']) : new Date(),
          gender: mapGender(row['Gender']),
          phone: row['ContactNo'] ? String(row['ContactNo']) : undefined,
          alternateMobile: row['AlternateContactNo'] ? String(row['AlternateContactNo']) : undefined,
          dateOfBirth: row['DateofBirth'] ? new Date(row['DateofBirth']) : undefined,
          address: row['PresentAddress'] ? String(row['PresentAddress']) : undefined,
          permanentAddress: row['PermanentAddress'] ? String(row['PermanentAddress']) : undefined,
          maritalStatus: mapMaritalStatus(row['MaritalStatus']),
          qualification: row['Qualification'] ? String(row['Qualification']) : undefined,
          experience: row['TotalExperience'] ? String(row['TotalExperience']) : (row['In_HouseExperience'] ? String(row['In_HouseExperience']) : undefined),
          emergencyContactName: row['Guardian Name'] ? String(row['Guardian Name']) : undefined,
          emergencyContactRelation: row['TypeOfRelation'] ? String(row['TypeOfRelation']) : undefined,
          location: row['BaseLocation'] ? String(row['BaseLocation']) : undefined,
          bankName: row['BankName'] ? String(row['BankName']) : undefined,
          bankAccountNumber: row['AccountNo'] ? String(row['AccountNo']) : undefined,
          ifscCode: row['IFSCode'] ? String(row['IFSCode']) : undefined,
          pfNumber: row['ProvidentFundNo'] ? String(row['ProvidentFundNo']) : undefined,
          uanNumber: row['UANNo'] ? String(row['UANNo']) : undefined,
          esiNumber: row['ESINo'] ? String(row['ESINo']) : undefined,
          panNumber: row['PANNo'] ? String(row['PANNo']) : undefined,
          aadhaarNumber: row['AadharNumber'] ? String(row['AadharNumber']) : undefined,
        }
      });
      console.log(`? Upserted ${fullName} (${empCode}) into ${deptName}`);
    } catch (e) {
      console.error(`? Failed to upsert ${fullName}:`, e);
    }
  }

  console.log('Import completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
