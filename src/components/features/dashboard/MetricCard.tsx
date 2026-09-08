import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  className?: string;
}

export function MetricCard({ label, value, icon: Icon, className }: MetricCardProps) {
  return (
    <Card className={cn('dashboard-metric-card', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="dashboard-metric-card__label">{label}</CardTitle>
        <Icon className="dashboard-metric-card__icon h-4 w-4" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <p className="dashboard-metric-card__value">{value}</p>
      </CardContent>
    </Card>
  );
}
