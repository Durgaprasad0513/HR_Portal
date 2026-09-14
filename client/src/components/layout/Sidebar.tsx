import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, Users, Laptop, Plane, Briefcase, 
  Target, ClipboardList, GraduationCap, Files, UserMinus, 
  Shield, History, ChevronRight, ChevronDown, Building2, CreditCard,
  ClipboardCheck, Calendar
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type SidebarNavItem = {
  name: string;
  path?: string;
  icon: LucideIcon;
  children?: SidebarNavItem[];
};

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';
  
  // By default, open the section that contains the current path
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    workspace: true,
    employees: true,
    expenses: true,
    auth: true,
  });
  const [openNavGroups, setOpenNavGroups] = useState<Record<string, boolean>>({
    'employees-time-off': true,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleNavGroup = (id: string) => {
    setOpenNavGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const workspaceNav: SidebarNavItem[] = [
    ...(isAdminOrHR ? [{ name: 'Recruitment', path: '/recruitment', icon: Briefcase }] : []),
    { name: 'Assets', path: '/assets', icon: Laptop },
    ...(isAdminOrHR ? [{ name: 'Attrition', path: '/attrition', icon: UserMinus }] : []),
    { name: 'Documents', path: '/documents', icon: Files },
    { name: 'Helpdesk', path: '/requests', icon: ClipboardList },
  ];

  const employeesNav: SidebarNavItem[] = [
    { name: 'Employees', path: '/employees', icon: Users },
    {
      name: 'Time Off',
      icon: Calendar,
      children: [
        { name: 'Apply for leave', path: '/leaves', icon: Calendar },
        { name: 'Leave history', path: '/leaves/history', icon: History },
        ...(isAdminOrHR ? [{ name: 'Leave approvals', path: '/leaves/approvals', icon: ClipboardList }] : []),
      ],
    },
    { name: 'Training', path: '/training', icon: GraduationCap },
    { name: 'Performance', path: '/performance', icon: Target },
  ];

  const expensesNav: SidebarNavItem[] = [
    { name: 'Travel', path: '/travel', icon: Plane },
    { name: 'Office Expenses', path: '/office-expenses', icon: Building2 },
  ];

  const authNav: SidebarNavItem[] = isAdminOrHR ? [
    { name: 'Role Management', path: '/roles', icon: Shield },
    { name: 'Audit Log', path: '/audit', icon: History }
  ] : [];

  const sections = [
    { id: 'employees', title: 'Employees', items: employeesNav, icon: Users },
    { id: 'workspace', title: 'Workspace', items: workspaceNav, icon: LayoutDashboard },
    { id: 'expenses', title: 'Expenses', items: expensesNav, icon: CreditCard },
    ...(authNav.length > 0 ? [{ id: 'auth', title: 'Authorization', items: authNav, icon: Shield }] : []),
  ];

  // Check if any child item is active
  const isNavItemActive = (path: string) => (
    location.pathname === path ||
    (path !== '/dashboard' && path !== '#' && location.pathname.startsWith(`${path}/`))
  );

  const isItemActive = (item: SidebarNavItem): boolean => (
    (item.path ? isNavItemActive(item.path) : false) ||
    Boolean(item.children?.some(isItemActive))
  );

  const isSectionActive = (items: SidebarNavItem[]) => items.some(isItemActive);

  return (
    <aside id="primary-sidebar" aria-label="Primary navigation" className="bg-sidebar text-white w-64 flex flex-col shadow-xl z-50 h-[calc(100vh-1rem)] m-2 rounded-xl shrink-0 overflow-hidden lg:h-[calc(100vh-2rem)] lg:m-4">
      {/* Brand */}
      <div className="h-20 flex items-center px-6 shrink-0 pt-2">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shrink-0">
            <ClipboardCheck className="h-6 w-6 text-sidebar" />
          </div>
          <span className="text-xl font-bold tracking-wide">HR Portal</span>
        </NavLink>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 px-3 flex flex-col gap-2 custom-scrollbar">
        <NavLink
          to="/dashboard"
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
            location.pathname === '/dashboard' ? "text-accent-400 bg-white/5" : "text-white/80 hover:text-accent-400"
          )}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>

        {sections.map((section) => {
          const isOpen = openSections[section.id];
          const hasActiveChild = isSectionActive(section.items);
          
          return (
            <div key={section.id} className="flex flex-col">
              <button
                onClick={() => toggleSection(section.id)}
                aria-expanded={isOpen}
                aria-controls={`sidebar-section-${section.id}`}
                className={cn(
                  "flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                  "hover:text-accent-400",
                  hasActiveChild ? "text-[#EAE0CF]" : "text-white/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-5 w-5" />
                  <span>{section.title}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 opacity-50" />
                ) : (
                  <ChevronRight className="h-4 w-4 opacity-50" />
                )}
              </button>
              
              {isOpen && (
                <div id={`sidebar-section-${section.id}`} className="mt-1 mb-2 ml-4 flex flex-col gap-1 border-l border-white/10 pl-3">
                  {section.items.map((item) => {
                    const isActive = isItemActive(item);

                    if (item.children) {
                      const groupId = `${section.id}-${item.name.toLowerCase().replace(/\s+/g, '-')}`;
                      const isGroupOpen = openNavGroups[groupId] ?? isActive;

                      return (
                        <div key={item.name}>
                          <button
                            type="button"
                            onClick={() => toggleNavGroup(groupId)}
                            aria-expanded={isGroupOpen}
                            aria-controls={`sidebar-nav-group-${groupId}`}
                            className={cn(
                              "flex w-full items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                              isActive
                                ? "text-[#EAE0CF] bg-white/5 font-semibold"
                                : "text-white/60 hover:text-accent-400 hover:bg-white/5"
                            )}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <item.icon className="h-4 w-4 shrink-0" />
                              <span>{item.name}</span>
                            </span>
                            {isGroupOpen ? (
                              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                            ) : (
                              <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
                            )}
                          </button>

                          {isGroupOpen && (
                            <div id={`sidebar-nav-group-${groupId}`} className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/10 pl-3">
                              {item.children.map((child) => {
                                const childIsActive = child.path ? isNavItemActive(child.path) : false;
                                return (
                                  <NavLink
                                    key={child.name}
                                    to={child.path || '#'}
                                    onClick={(e) => {
                                      if (!child.path) e.preventDefault();
                                    }}
                                    className={cn(
                                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                                      childIsActive
                                        ? "text-[#EAE0CF] bg-white/5 font-semibold"
                                        : "text-white/60 hover:text-accent-400 hover:bg-white/5"
                                    )}
                                  >
                                    <child.icon className="h-4 w-4 shrink-0" />
                                    <span>{child.name}</span>
                                  </NavLink>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <NavLink
                        key={item.name}
                        to={item.path || '#'}
                        onClick={(e) => {
                          if (!item.path) e.preventDefault();
                        }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                          isActive
                            ? "text-[#EAE0CF] bg-white/5 font-semibold"
                            : "text-white/60 hover:text-accent-400 hover:bg-white/5"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
