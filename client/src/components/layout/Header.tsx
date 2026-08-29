import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, LogOut, User, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useTheme } from 'next-themes';

export function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 transition-colors">
        <div className="flex items-center flex-1">
          <Button variant="ghost" size="sm" className="md:hidden mr-2">
            <Menu className="h-5 w-5" />
          </Button>
          
          <button 
            onClick={() => setCmdOpen(true)}
            className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-transparent w-64 justify-between"
          >
            <div className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              <span>Search...</span>
            </div>
            <kbd className="hidden sm:inline-block text-xs font-semibold px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-900">Ctrl K</kbd>
          </button>
        </div>

        <div className="flex items-center space-x-4 relative">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-gray-600 dark:text-gray-300"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <div 
            className="flex items-center cursor-pointer space-x-2"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
              {user?.employee?.firstName ? `${user.employee.firstName} ${user.employee.lastName}` : user?.email}
            </span>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 top-10 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50 border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-gray-700">
                Signed in as {user?.role}
              </div>
              <button 
                className="flex w-full items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-700"
                onClick={() => {}} 
              >
                <User className="mr-2 h-4 w-4" /> Profile
              </button>
              <button 
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-gray-700"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </>
  );
}
