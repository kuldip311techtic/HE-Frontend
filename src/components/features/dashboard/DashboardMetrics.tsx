import {
  Building2,
  CreditCard,
  Timer,
  TrendingUp,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { MetricCard, MetricCardSkeleton } from '@/components/features/dashboard/MetricCard';
import { formatNumber, formatWholeCurrency } from '@/lib/utils/format';
import type { SuperAdminDashboardMetrics } from '@/types/api';

const METRICS: Array<{
  key: keyof SuperAdminDashboardMetrics;
  label: string;
  icon: LucideIcon;
  to?: string;
  revenue?: boolean;
}> = [
  {
    key: 'total_organizations',
    label: 'Total Organizations',
    icon: Building2,
    to: '/admin/organizations',
  },
  { key: 'total_coaches', label: 'Total Coaches', icon: Users, to: '/admin/users' },
  { key: 'total_players', label: 'Total Players', icon: UserRound, to: '/admin/users' },
  { key: 'total_sessions', label: 'Total Sessions', icon: Timer },
  {
    key: 'active_subscriptions',
    label: 'Active Subscriptions',
    icon: CreditCard,
    to: '/admin/subscriptions',
  },
  {
    key: 'revenue_overview',
    label: 'Revenue Overview',
    icon: TrendingUp,
    to: '/admin/analytics',
    revenue: true,
  },
];

interface DashboardMetricsProps {
  metrics?: SuperAdminDashboardMetrics;
  loading?: boolean;
}

export function DashboardMetrics({ metrics, loading = false }: DashboardMetricsProps) {
  return (
    <section aria-labelledby="dashboard-metrics-heading" className="space-y-4">
      <div>
        <h2 id="dashboard-metrics-heading" className="text-body-25 text-foreground">
          Platform metrics
        </h2>
        <p className="text-body-sm text-muted-foreground">
          Totals from the Super Admin dashboard. Zero is a valid empty result.
        </p>
      </div>
      <div
        className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6"
        aria-busy={loading}
        aria-live="polite"
      >
        {METRICS.map((metric) => {
          if (loading) {
            return <MetricCardSkeleton key={metric.key} />;
          }
          const raw = metrics?.[metric.key];
          const numeric = typeof raw === 'number' ? raw : 0;
          const value = metric.revenue ? formatWholeCurrency(numeric) : formatNumber(numeric);
          return (
            <MetricCard
              key={metric.key}
              label={metric.label}
              value={value}
              icon={metric.icon}
              to={metric.to}
            />
          );
        })}
      </div>
    </section>
  );
}
