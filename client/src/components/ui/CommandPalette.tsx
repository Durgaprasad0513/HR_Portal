import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { Search, User, FileText, Settings, LayoutDashboard, Briefcase, Plane, Laptop, Star, GraduationCap, LifeBuoy, FileCheck, BarChart3, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
      <Command 
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <Command.Input 
            autoFocus
            placeholder="Search resources, people, settings..." 
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-medium"
          />
        </div>
        
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-gray-500">No results found.</Command.Empty>
          
          <Command.Group heading="Navigation" className="text-xs font-semibold text-gray-500 mb-2 px-2">
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/'))}
              className="flex items-center px-3 py-2 mt-1 rounded-md cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 aria-selected:text-primary-600 dark:aria-selected:text-primary-400 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 mr-3" />
              Dashboard
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/people'))}
              className="flex items-center px-3 py-2 mt-1 rounded-md cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 aria-selected:text-primary-600 dark:aria-selected:text-primary-400 transition-colors"
            >
              <User className="w-4 h-4 mr-3" />
              People
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/recruitment'))}
              className="flex items-center px-3 py-2 mt-1 rounded-md cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 aria-selected:text-primary-600 dark:aria-selected:text-primary-400 transition-colors"
            >
              <Briefcase className="w-4 h-4 mr-3" />
              Recruitment
            </Command.Item>
          </Command.Group>
          
          <Command.Group heading="Settings & Actions" className="text-xs font-semibold text-gray-500 mb-2 px-2 mt-4">
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/profile'))}
              className="flex items-center px-3 py-2 mt-1 rounded-md cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 aria-selected:text-primary-600 dark:aria-selected:text-primary-400 transition-colors"
            >
              <User className="w-4 h-4 mr-3" />
              My Profile
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => navigate('/settings'))}
              className="flex items-center px-3 py-2 mt-1 rounded-md cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 aria-selected:text-primary-600 dark:aria-selected:text-primary-400 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3" />
              Preferences
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
