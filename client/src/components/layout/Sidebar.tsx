import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, Bell, Settings, LogOut, User, ChevronDown,
  LayoutDashboard, Users, ListTodo, Clock, Star, UserSearch, FileText, Newspaper
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/ui/CommandPalette';

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Employees Management', path: '/employees', icon: Users },
    { name: 'Task Lists', path: '/tasks', icon: ListTodo },
    { name: 'Time Tracking', path: '/attendance', icon: Clock },
    { name: 'Performance', path: '/performance', icon: Star },
    { name: 'Recruitment', path: '/recruitment', icon: UserSearch },
  ];

  const moreNav = [
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'News', path: '/news', icon: Newspaper },
  ];

  const isMoreActive = moreNav.some(item => location.pathname.startsWith(item.path));

  return (
    <>
      <nav className="bg-navy-900 text-white h-14 flex items-center px-4 lg:px-6 shadow-md relative z-50">
        {/* Brand */}
        <NavLink to="/dashboard" className="flex items-center gap-2 mr-8 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-lg">
            m
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:block">HRMagnet</span>
        </NavLink>

        {/* Main nav links */}
        <div className="hidden lg:flex items-center gap-1 flex-1 min-w-0">
          {mainNav.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                  isActive
                    ? "text-accent-500"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {item.name}
              </NavLink>
            );
          })}

          {/* More dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
                isMoreActive
                  ? "text-accent-500"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              More <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {moreOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-1 z-50">
                {moreNav.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMoreOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-2 px-4 py-2.5 text-sm transition-colors",
                      isActive
                        ? "text-accent-500 bg-accent-50"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Search */}
          <button
            onClick={() => setCmdOpen(true)}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            title="Search (Ctrl+K)"
          >
            <Search className="h-4 w-4 text-white/80" />
          </button>

          {/* Notifications */}
          <NavLink
            to="/notifications"
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors relative"
          >
            <Bell className="h-4 w-4 text-white/80" />
          </NavLink>

          {/* Settings */}
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <Settings className="h-4 w-4 text-white/80" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-white/20 mx-1 hidden sm:block" />

          {/* Company label */}
          <span className="text-xs text-white/60 font-medium hidden xl:block">PeopleFlow</span>

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 hover:bg-white/10 rounded-full p-0.5 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-accent-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 rounded-lg bg-white shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.employee?.firstName ? `${user.employee.firstName} ${user.employee.lastName}` : user?.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{user?.role}</p>
                </div>
                <button
                  onClick={() => { setProfileOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4" /> My Profile
                </button>
                <button
                  onClick={() => { setProfileOpen(false); logout(); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile nav bar (shows on small screens) */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 overflow-x-auto">
        <div className="flex items-center gap-1 py-2">
          {mainNav.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-accent-50 text-accent-600"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </div>

      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </>
  );
}
