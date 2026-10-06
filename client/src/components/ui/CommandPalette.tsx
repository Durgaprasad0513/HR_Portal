import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { employeesApi } from '@/api/employees';
import { useDebounce } from '@/hooks/useDebounce';
import { hasAdminAccess } from '@/utils/roles';
import {
 LayoutDashboard, Users, Laptop, Plane, Briefcase,
 Target, ClipboardList, GraduationCap, Files, UserMinus,
 Shield, History, CreditCard, HelpCircle, Calendar, Settings
} from 'lucide-react';
import {
 CommandDialog,
 CommandEmpty,
 CommandGroup,
 CommandInput,
 CommandItem,
 CommandList,
 CommandSeparator,
} from "@/components/ui/command";

interface CommandPaletteProps {
 open: boolean;
 setOpen: (open: boolean) => void;
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
 const navigate = useNavigate();
 const { user } = useAuth();
 const [search, setSearch] = useState('');
 const debouncedSearch = useDebounce(search.trim(), 250);

 const isAdminOrHR = hasAdminAccess(user?.role);

 const { data: employeeResponse, isFetching: isSearchingEmployees } = useQuery({
 queryKey: ['global-employee-search', debouncedSearch],
 queryFn: () => employeesApi.getAll({ search: debouncedSearch, limit: 6 }),
 enabled: open && debouncedSearch.length >= 2,
 staleTime: 30_000,
 });
 const employeeResults = employeeResponse?.data || [];

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

 useEffect(() => {
 if (!open) setSearch('');
 }, [open]);

 const runCommand = (command: () => void) => {
 setOpen(false);
 command();
 };

 // Flattened sidebar navigation mapping
 const mainNav = [
 { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
 ...(isAdminOrHR ? [{ name: 'Attrition', path: '/dashboard/attrition', icon: UserMinus }] : []),
 { name: 'Employees', path: '/employees', icon: Users },
 { name: 'Performance', path: '/performance', icon: Target },
 { name: 'Apply for leave', path: '/leaves', icon: Calendar },
 ...(isAdminOrHR ? [{ name: 'Leave approvals', path: '/leaves/approvals', icon: ClipboardList }] : []),
 ...(isAdminOrHR ? [{ name: 'Recruitment', path: '/recruitment', icon: Briefcase }] : []),
 { name: 'Training', path: '/training', icon: GraduationCap },
 { name: 'Assets', path: '/assets', icon: Laptop },
 { name: 'Travel', path: '/travel', icon: Plane },
 { name: 'Expenses', path: '/office-expenses', icon: CreditCard },
 { name: 'Documents', path: '/documents', icon: Files },
 { name: 'Helpdesk', path: '/requests', icon: HelpCircle },
 ];

 const accountNav = [
 ...(isAdminOrHR ? [
 { name: 'Role Management', path: '/roles', icon: Shield },
 { name: 'Audit Log', path: '/audit', icon: History },
 ] : [])
 ];

 return (
 <CommandDialog open={open} onOpenChange={setOpen}>
 <CommandInput value={search} onValueChange={setSearch} placeholder="Search modules or employee names..." />
 <CommandList>
 <CommandEmpty>{isSearchingEmployees ? 'Searching employees...' : 'No results found.'}</CommandEmpty>

 {debouncedSearch.length >= 2 && employeeResults.length > 0 && (
 <CommandGroup heading="Employees">
 {employeeResults.map((employee) => (
 <CommandItem
 key={employee.id}
 value={`${employee.firstName} ${employee.lastName} ${employee.employeeCode} ${employee.designation || ''} ${employee.department?.name || ''}`}
 onSelect={() => runCommand(() => navigate(`/employees/${employee.id}`))}
 >
 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
 {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
 </div>
 <div className="min-w-0 flex-1">
 <p className="truncate font-medium">{employee.firstName} {employee.lastName}</p>
 <p className="truncate text-xs text-text-muted">{employee.employeeCode} · {employee.designation || employee.department?.name || 'Employee'}</p>
 </div>
 </CommandItem>
 ))}
 </CommandGroup>
 )}

 <CommandGroup heading="Navigation">
 {mainNav.map((item) => (
 <CommandItem key={item.path} onSelect={() => runCommand(() => navigate(item.path))}>
 <item.icon size={16} strokeWidth={2} className="opacity-60 mr-3" aria-hidden="true" />
 <span>{item.name}</span>
 </CommandItem>
 ))}
 </CommandGroup>

 <CommandSeparator />

 <CommandGroup heading="Account">
 {accountNav.map((item) => (
 <CommandItem key={item.path} onSelect={() => runCommand(() => navigate(item.path))}>
 <item.icon size={16} strokeWidth={2} className="opacity-60 mr-3" aria-hidden="true" />
 <span>{item.name}</span>
 </CommandItem>
 ))}
 </CommandGroup>
 </CommandList>
 </CommandDialog>
 );
}
