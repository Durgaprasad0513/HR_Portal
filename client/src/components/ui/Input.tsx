import React, { useState, useRef, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error: externalError, required, onBlur, onChange, onInvalid, ...props }, ref) => {
    const [touched, setTouched] = useState(false);
    const [internalError, setInternalError] = useState('');
    const innerRef = useRef<HTMLInputElement>(null);

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

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          className={cn(
            "flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
            displayError && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={innerRef}
          required={required}
          onBlur={handleBlur}
          onChange={handleChange}
          onInvalid={handleInvalid}
          {...props}
        />
        {displayError && (
          <p className="mt-1 text-sm text-red-500">{displayError}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
