import React, { useId, useState, useRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ className, label, error: externalError, required, onBlur, onChange, onInvalid, id, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
 const [touched, setTouched] = useState(false);
 const [internalError, setInternalError] = useState('');
 const innerRef = useRef<HTMLInputElement>(null);
 const generatedId = useId();
 const inputId = id || `input-${generatedId}`;

 useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

 const validate = (el: HTMLInputElement) => {
 if (!el.validity.valid) {
 setInternalError(el.validationMessage);
 } else {
 setInternalError('');
 }
 };

 const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
 setTouched(true);
 validate(e.target);
 if (onBlur) onBlur(e);
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (touched) validate(e.target);
 if (onChange) onChange(e);
 };
 
 const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
 setTouched(true);
 validate(e.currentTarget);
 if (onInvalid) onInvalid(e);
 };

 const displayError = externalError || (touched && internalError ? internalError : '');
 const errorId = `${inputId}-error`;
 const describedBy = [ariaDescribedBy, displayError ? errorId : undefined].filter(Boolean).join(' ') || undefined;

 return (
 <div className="w-full">
 {label && (
 <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
 {label} {required && <span className="text-red-500" aria-hidden="true">*</span>}
 </label>
 )}
 <input
 id={inputId}
 className={cn(
 "flex h-[42px] w-full rounded-[1.25rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface px-4 py-2 text-[13px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
 displayError && "border-red-500",
 className
 )}
 ref={innerRef}
 required={required}
 onBlur={handleBlur}
 onChange={handleChange}
 onInvalid={handleInvalid}
 aria-invalid={Boolean(displayError)}
 aria-describedby={describedBy}
 {...props}
 />
 {displayError && (
 <p id={errorId} className="mt-1 text-sm text-red-500" role="alert">{displayError}</p>
 )}
 </div>
 );
 }
);
Input.displayName = "Input";

