import { createEmployeeSchema, updateEmployeeSchema } from '../src/modules/employees/employee.schema';

const employee = { employeeCode: 'QA', firstName: 'Test', lastName: 'Employee', email: 'test@example.invalid', designation: 'Tester', joiningDate: '2026-10-14' };

describe('employee form validation', () => {
  it('creates an employee without optional personal details', () => {
    expect(createEmployeeSchema.safeParse(employee).success).toBe(true);
  });
  it.each(['phone', 'alternateMobile', 'emergencyContactNumber'])('rejects malformed %s while accepting ten digits', (field) => {
    expect(createEmployeeSchema.safeParse({ ...employee, [field]: '123' }).success).toBe(false);
    expect(createEmployeeSchema.safeParse({ ...employee, [field]: '1234567890' }).success).toBe(true);
  });
  it('allows clearing optional fields on edit and preserves zero values', () => {
    expect(updateEmployeeSchema.parse({ qualification: null, phone: null, dateOfBirth: null, departmentId: null, gender: null, ctc: null, probationPeriod: 0 })).toMatchObject({ qualification: null, probationPeriod: 0 });
  });
  it('rejects invalid emails and negative periods', () => {
    expect(updateEmployeeSchema.safeParse({ personalEmail: 'broken' }).success).toBe(false);
    expect(updateEmployeeSchema.safeParse({ probationPeriod: -1 }).success).toBe(false);
  });
});
