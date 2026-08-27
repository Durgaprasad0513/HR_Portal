
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Clock, 
  CalendarDays,
  FilePlus,
  History,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Employees', path: '/employees', icon: Users, roles: ['ADMIN', 'HR', 'MANAGER'] },
    { name: 'Departments', path: '/departments', icon: Building2, roles: ['ADMIN', 'HR'] },
    { name: 'Attendance', path: '/attendance', icon: Clock, roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
  ];

  const leaveItems = [
    { name: 'Apply Leave', path: '/leaves/apply', icon: FilePlus, roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { name: 'My Leaves', path: '/leaves/history', icon: History, roles: ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'] },
    { name: 'Approvals', path: '/leaves/approvals', icon: CheckSquare, roles: ['ADMIN', 'HR', 'MANAGER'] },
  ];

  const filterRoles = (items: any[]) => items.filter(item => user && item.roles.includes(user.role));

  const filteredNavItems = filterRoles(navItems);
  const filteredLeaveItems = filterRoles(leaveItems);

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-900 text-slate-300">
      <div className="flex h-16 items-center px-6 text-xl font-bold text-white border-b border-slate-800">
        HR Portal
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors",
                isActive ? "bg-slate-800 text-indigo-400" : "text-slate-300"
              )}
            >
              <item.icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                location.pathname.startsWith(item.path) ? "text-indigo-400" : "text-slate-400 group-hover:text-white"
              )} />
              {item.name}
            </NavLink>
          ))}

          {filteredLeaveItems.length > 0 && (
            <div className="pt-4">
              <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Leaves
              </div>
              <div className="space-y-1">
                {filteredLeaveItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors",
                      isActive ? "bg-slate-800 text-indigo-400" : "text-slate-300"
                    )}
                  >
                    <item.icon className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      location.pathname === item.path ? "text-indigo-400" : "text-slate-400 group-hover:text-white"
                    )} />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
