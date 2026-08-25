import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          Super Admin
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-8 text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex shrink-0 items-center">{action}</div>
      ) : null}
    </div>
  );
}
