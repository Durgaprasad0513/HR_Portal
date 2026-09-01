import { useState, useRef, useEffect } from 'react';
import { Laptop } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { 
  Search, Bell, Settings, LogOut, User, ChevronRight,
  LayoutDashboard, Users, UserSearch, FileText, BarChart, Shield, History, Plane,
  Briefcase, Target, ClipboardList, GraduationCap, Files, UserMinus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/ui/CommandPalette';

export function Sidebar() {
  const { user, logout } = useAuth();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const logoUrl = '/logo.png'; 
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isAdminOrHR = user?.role === 'ADMIN' || user?.role === 'HR';

  const workspaceNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Assets', path: '/assets', icon: Laptop },
    { name: 'Travel', path: '/travel', icon: Plane },
    { name: 'Recruitment', path: '/recruitment', icon: Briefcase },
    { name: 'Performance', path: '/performance', icon: Target },
    { name: 'Requests', path: '/requests', icon: ClipboardList },
    { name: 'Training', path: '/training', icon: GraduationCap },
    { name: 'Documents', path: '/documents', icon: Files },
    ...(isAdminOrHR ? [
      { name: 'Reports', path: '/reports', icon: BarChart },
      { name: 'Attrition', path: '/attrition', icon: UserMinus },
    ] : [])
  ];

  const authNav = isAdminOrHR ? [
    { name: 'Role Mgt', path: '/roles', icon: Shield },
    { name: 'Audit Log', path: '/audit', icon: History }
  ] : [];

  return (
    <>
      <aside className="bg-navy-900 text-white w-64 flex flex-col shadow-xl z-50 h-screen shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <img 
              src={logoUrl} 
              alt="Lohitha Logo" 
              className="h-8 w-8 rounded-full object-contain bg-white dark:bg-gray-900/10 p-0.5"
            />
            <span className="text-lg font-bold tracking-tight">HR Management</span>
          </NavLink>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-6">
          {/* Workspace */}
          <div>
            <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Workspace</p>
            <div className="flex flex-col gap-1">
              {workspaceNav.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-accent-500/20 text-accent-400"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-accent-400" : "text-white/50")} />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Authorization */}
          {authNav.length > 0 && (
            <div>
              <p className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Authorization</p>
              <div className="flex flex-col gap-1">
                {authNav.map((item) => {
                  const isActive = location.pathname === item.path || 
                    (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-accent-500/20 text-accent-400"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", isActive ? "text-accent-400" : "text-white/50")} />
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </aside>
    </>
  );
}
