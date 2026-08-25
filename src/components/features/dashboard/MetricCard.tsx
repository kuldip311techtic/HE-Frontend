import type { LucideIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number;
  description?: string;
  icon: LucideIcon;
  format?: 'number' | 'currency';
  empty?: boolean;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  format = 'number',
  empty = false,
}: MetricCardProps) {
  const formattedValue =
    format === 'currency' ? formatCurrency(value) : formatNumber(value);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10"
          aria-hidden="true"
        >
          <Icon className="h-4 w-4 text-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            'text-2xl font-bold tabular-nums text-foreground sm:text-3xl',
            empty && 'text-muted-foreground',
          )}
          aria-label={`${title}: ${formattedValue}`}
        >
          {formattedValue}
        </p>
        {description ? (
          <CardDescription className="mt-1">{description}</CardDescription>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function MetricCardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="mt-2 h-3 w-32" />
      </CardContent>
    </Card>
  );
}
