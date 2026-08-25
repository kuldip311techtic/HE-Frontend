import {
  Building2,
  CalendarDays,
  CreditCard,
  DollarSign,
  UserCircle,
  Users,
} from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import type { DashboardMetrics } from '@/types/dashboard';
import { MetricCard, MetricCardSkeleton } from './MetricCard';

interface DashboardMetricsProps {
  metrics?: DashboardMetrics;
  loading?: boolean;
}

const METRIC_CONFIG = [
  {
    key: 'total_organizations' as const,
    title: 'Total Organizations',
    description: 'Registered organizations on the platform',
    icon: Building2,
    format: 'number' as const,
  },
  {
    key: 'total_coaches' as const,
    title: 'Total Coaches',
    description: 'Active coaching staff across organizations',
    icon: Users,
    format: 'number' as const,
  },
  {
    key: 'total_players' as const,
    title: 'Total Players',
    description: 'Players enrolled in programs',
    icon: UserCircle,
    format: 'number' as const,
  },
  {
    key: 'total_sessions' as const,
    title: 'Total Sessions',
    description: 'Training and game sessions recorded',
    icon: CalendarDays,
    format: 'number' as const,
  },
  {
    key: 'active_subscriptions' as const,
    title: 'Active Subscriptions',
    description: 'Currently active subscription plans',
    icon: CreditCard,
    format: 'number' as const,
  },
  {
    key: 'revenue_overview' as const,
    title: 'Revenue Overview',
    description: 'Total platform revenue to date',
    icon: DollarSign,
    format: 'currency' as const,
  },
];

function isMetricsEmpty(metrics: DashboardMetrics): boolean {
  return (
    metrics.total_organizations === 0 &&
    metrics.total_coaches === 0 &&
    metrics.total_players === 0 &&
    metrics.total_sessions === 0 &&
    metrics.active_subscriptions === 0 &&
    metrics.revenue_overview === 0
  );
}

export default function DashboardMetrics({
  metrics,
  loading = false,
}: DashboardMetricsProps) {
  if (loading || !metrics) {
    return (
      <section
        aria-label="Platform metrics"
        aria-busy="true"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {METRIC_CONFIG.map((config) => (
          <MetricCardSkeleton key={config.key} />
        ))}
      </section>
    );
  }

  if (isMetricsEmpty(metrics)) {
    return (
      <EmptyState
        title="No analytics data available"
        description="Platform metrics will appear here once organizations, coaches, and players begin using the system."
        icon={Building2}
      />
    );
  }

  return (
    <section
      aria-label="Platform metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {METRIC_CONFIG.map((config) => (
        <MetricCard
          key={config.key}
          title={config.title}
          value={metrics[config.key]}
          description={config.description}
          icon={config.icon}
          format={config.format}
          empty={metrics[config.key] === 0}
        />
      ))}
    </section>
  );
}
