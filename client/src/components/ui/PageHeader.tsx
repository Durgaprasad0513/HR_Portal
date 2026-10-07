import { ReactNode } from 'react';

interface PageHeaderProps {
 title: string;
 description?: string;
 actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
 return (
 <div className="flex w-full min-w-0 flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
 <div className="min-w-0">
 <h1 className="text-xl font-bold tracking-tight text-text-heading sm:text-2xl">{title}</h1>
 {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
 </div>
 {actions && <div className="flex w-full min-w-0 flex-wrap items-center justify-start gap-2 2xl:w-auto 2xl:justify-end [&>div]:max-w-full [&>div]:flex-wrap [&_button]:shrink-0">{actions}</div>}
 </div>
 );
}
