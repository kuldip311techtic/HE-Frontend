import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';

interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  to?: string;
  className?: string;
}

export function MetricCard({ label, value, icon: Icon, to, className }: MetricCardProps) {
  const card = (
    <Card
      className={cn(
        'min-h-[108px] transition-colors',
        to && 'hover:bg-muted/40 active:bg-muted/60',
        className,
      )}
    >
      <CardContent className="flex h-full flex-col justify-between gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-body-sm text-muted-foreground">{label}</p>
          {Icon ? <Icon className="h-4 w-4 shrink-0 text-figma-brand" aria-hidden /> : null}
        </div>
        <p className="font-outfit text-lg font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );

  if (!to) return card;

  return (
    <NavLink
      to={to}
      aria-label={`View ${label}`}
      className="rounded-figma-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
    >
      {card}
    </NavLink>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="min-h-[108px] rounded-figma-10 border border-figma-border bg-card p-4">
      <Skeleton className="mb-6 h-4 w-24" />
      <Skeleton className="h-6 w-16" />
    </div>
  );
}
