import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <Icon className="h-10 w-10 text-slate-600" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">{title}</h2>
        <p className="mb-8 mt-2 text-center text-sm font-normal leading-6 text-slate-500">
          {description}
        </p>
        {action}
      </div>
    </div>
  );
}
