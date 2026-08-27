import React from 'react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center space-x-4 relative">
        <div 
          className="flex items-center cursor-pointer space-x-2"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">
            {user?.email?.[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden sm:block">
            {user?.employee?.firstName ? `${user.employee.firstName} ${user.employee.lastName}` : user?.email}
          </span>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 top-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="px-4 py-2 text-xs text-slate-500 border-b">
              Signed in as {user?.role}
            </div>
            <button 
              className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => {}} // Add profile link here if needed
            >
              <User className="mr-2 h-4 w-4" /> Profile
            </button>
            <button 
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
