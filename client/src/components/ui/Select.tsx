import React, { useState, useRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error: externalError, required, onBlur, onChange, onInvalid, children, ...props }, ref) => {
    const [touched, setTouched] = useState(false);
    const [internalError, setInternalError] = useState('');
    const innerRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle(ref, () => innerRef.current as HTMLSelectElement);

    const validate = (el: HTMLSelectElement) => {
      if (!el.validity.valid) {
        setInternalError(el.validationMessage);
      } else {
        setInternalError('');
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setTouched(true);
      validate(e.target);
      if (onBlur) onBlur(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (touched) validate(e.target);
      if (onChange) onChange(e);
    };
    
    const handleInvalid = (e: React.FormEvent<HTMLSelectElement>) => {
      setTouched(true);
      validate(e.currentTarget);
      if (onInvalid) onInvalid(e);
    };

    const displayError = externalError || (touched && internalError ? internalError : '');

    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
            displayError && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={innerRef}
          required={required}
          onBlur={handleBlur}
          onChange={handleChange}
          onInvalid={handleInvalid}
          {...props}
        >
          {children}
        </select>
        {displayError && (
          <p className="mt-1 text-sm text-red-500">{displayError}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
