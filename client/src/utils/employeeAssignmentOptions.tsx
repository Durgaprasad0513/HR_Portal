import type { ReactNode } from 'react';

export function employeeAssignmentOptions(employees: any[] = []): ReactNode[] {
  const activeEmployees = employees.filter((employee) => !employee.user || employee.user.isActive);
  const managers = activeEmployees.filter((employee) => employee.user?.role === 'MANAGER');
  const otherEmployees = activeEmployees.filter((employee) => employee.user?.role !== 'MANAGER');

  return [...managers, ...otherEmployees].map((employee) => {
    const name = `${employee.firstName} ${employee.lastName}`.trim();
    const label = employee.user?.role === 'MANAGER' ? `Manager · ${name}` : name;
    return <option key={employee.id} value={employee.id}>{label}</option>;
  });
}
