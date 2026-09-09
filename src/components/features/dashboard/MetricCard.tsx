import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  className?: string;
}

export function MetricCard({ label, value, icon: Icon, className }: MetricCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col justify-between gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-body-sm text-muted-foreground">{label}</p>
          {Icon ? <Icon className="h-4 w-4 shrink-0 text-figma-brand" aria-hidden /> : null}
        </div>
        <p className="font-outfit text-lg font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-figma-10 border border-figma-border bg-card p-4">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}
