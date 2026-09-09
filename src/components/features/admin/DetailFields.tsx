import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  multiline?: boolean;
  className?: string;
}

export function DetailRow({ label, value, multiline = false, className }: DetailRowProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <dt className="font-lato text-body-sm font-medium text-figma-accent">{label}</dt>
      <dd
        className={cn(
          'text-body-sm text-foreground',
          multiline && 'whitespace-pre-wrap',
        )}
      >
        {value}
      </dd>
    </div>
  );
}

interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="space-y-3">
      <h3 className="text-body-sm font-semibold text-foreground">{title}</h3>
      <dl className="grid gap-4">{children}</dl>
    </section>
  );
}
