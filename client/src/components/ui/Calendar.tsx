import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
 format,
 addMonths,
 subMonths,
 startOfMonth,
 endOfMonth,
 startOfWeek,
 endOfWeek,
 isSameMonth,
 isSameDay,
 addDays,
 isToday,
 getYear,
 getMonth,
 setYear,
 setMonth
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface CalendarProps {
 value?: Date;
 onChange?: (date: Date) => void;
 className?: string;
}

export function Calendar({ value, onChange, className }: CalendarProps) {
 const [currentMonth, setCurrentMonth] = useState(value || new Date());

 const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
 const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
 const onDateClick = (day: Date) => {
 if (onChange) onChange(day);
 };

 const renderHeader = () => {
 const currentYear = getYear(currentMonth);
 const currentMonthValue = getMonth(currentMonth);

 const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
 setCurrentMonth(setYear(currentMonth, parseInt(e.target.value)));
 };

 const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
 setCurrentMonth(setMonth(currentMonth, parseInt(e.target.value)));
 };

 const years = [];
 for (let i = 1950; i <= new Date().getFullYear() + 20; i++) {
 years.push(i);
 }
 
 const months = [
 'January', 'February', 'March', 'April', 'May', 'June',
 'July', 'August', 'September', 'October', 'November', 'December'
 ];

 return (
 <div className="flex justify-between items-center mb-4">
 <Button
 variant="ghost"
 type="button"
 onClick={prevMonth}
 className="h-8 w-8 p-0 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 shrink-0"
 >
 <ChevronLeft className="h-4 w-4" />
 </Button>
 
 <div className="flex gap-1 font-semibold text-sm text-slate-900 dark:text-slate-100 items-center justify-center flex-1">
 <select 
 value={currentMonthValue} 
 onChange={handleMonthChange}
 className="bg-transparent border-none focus:ring-0 cursor-pointer outline-none hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1 py-1 text-sm font-semibold appearance-none text-center"
 style={{ backgroundImage: 'none' }}
 >
 {months.map((m, idx) => <option key={m} value={idx} className="text-slate-900 dark:bg-gray-800 dark:text-white">{m}</option>)}
 </select>
 
 <select 
 value={currentYear} 
 onChange={handleYearChange}
 className="bg-transparent border-none focus:ring-0 cursor-pointer outline-none hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1 py-1 text-sm font-semibold appearance-none text-center"
 style={{ backgroundImage: 'none' }}
 >
 {years.map(y => <option key={y} value={y} className="text-slate-900 dark:bg-gray-800 dark:text-white">{y}</option>)}
 </select>
 </div>
 
 <Button
 variant="ghost"
 type="button"
 onClick={nextMonth}
 className="h-8 w-8 p-0 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 shrink-0"
 >
 <ChevronRight className="h-4 w-4" />
 </Button>
 </div>
 );
 };

 const renderDays = () => {
 const dateFormat = 'EEEEEE';
 const days = [];
 const startDate = startOfWeek(currentMonth);
 for (let i = 0; i < 7; i++) {
 days.push(
 <div className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-1" key={i}>
 {format(addDays(startDate, i), dateFormat)}
 </div>
 );
 }
 return <div className="grid grid-cols-7 mb-2">{days}</div>;
 };

 const renderCells = () => {
 const monthStart = startOfMonth(currentMonth);
 const monthEnd = endOfMonth(monthStart);
 const startDate = startOfWeek(monthStart);
 const endDate = endOfWeek(monthEnd);

 const rows = [];
 let days = [];
 let day = startDate;
 let formattedDate = '';

 while (day <= endDate) {
 for (let i = 0; i < 7; i++) {
 formattedDate = format(day, 'd');
 const cloneDay = day;
 
 const isSelected = value ? isSameDay(day, value) : false;
 const isCurrentMonth = isSameMonth(day, monthStart);
 const isTodayDate = isToday(day);

 days.push(
 <button
 type="button"
 key={day.toString()}
 onClick={() => onDateClick(cloneDay)}
 className={cn(
 "h-8 w-8 flex items-center justify-center rounded-full text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900",
 !isCurrentMonth ? "text-slate-300 dark:text-slate-600 cursor-not-allowed pointer-events-none" : "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
 isTodayDate && !isSelected && "bg-slate-100 dark:bg-slate-800 font-semibold text-brand-primary",
 isSelected && isCurrentMonth && "bg-brand-primary text-white font-semibold hover:bg-brand-hover shadow-sm"
 )}
 disabled={!isCurrentMonth}
 >
 <span>{formattedDate}</span>
 </button>
 );
 day = addDays(day, 1);
 }
 rows.push(
 <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
 {days}
 </div>
 );
 days = [];
 }
 return <div>{rows}</div>;
 };

 return (
 <div className={cn("p-4 bg-surface border border-slate-border rounded-xl shadow-sm inline-block select-none", className)}>
 {renderHeader()}
 {renderDays()}
 {renderCells()}
 </div>
 );
}
