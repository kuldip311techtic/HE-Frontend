import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';

interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  className?: string;
}

export function MetricCard({ label, value, icon: Icon, className }: MetricCardProps) {
  return (
    <Card className={cn('admin-dashboard-metric-card', className)}>
      <CardContent className="flex h-full min-h-[168px] flex-col justify-between gap-3 p-5">
        {Icon ? (
          <div className="admin-dashboard-metric-card__icon">
            <Icon className="h-4 w-4" aria-hidden />
          </div>
        ) : (
          <div />
        )}
        <div>
          <p className="font-outfit text-[clamp(1.85rem,2.6vw,2.35rem)] font-bold leading-[1.1] text-foreground">
            {value}
          </p>
          <p className="mt-2.5 font-outfit text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9aa89e]">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="admin-dashboard-metric-card flex min-h-[168px] flex-col justify-between rounded-xl border border-figma-border bg-card p-5">
      <Skeleton className="h-9 w-9 rounded-[10px]" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}
