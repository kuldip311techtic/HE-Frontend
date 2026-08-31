import {
  Activity,
  Building2,
  DollarSign,
  RefreshCw,
  UserCheck,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  EmptyState,
  ErrorState,
  PageHeader,
} from '@/components/shared/PageHeader';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { DashboardData } from '@/types';

function isDashboardEmpty(data: DashboardData): boolean {
  return (
    data.total_organizations === 0 &&
    data.total_coaches === 0 &&
    data.total_players === 0 &&
    data.total_sessions === 0 &&
    data.active_subscriptions === 0 &&
    data.revenue_overview === 0
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function DashboardContent({ data }: { data: DashboardData }) {
  const stats = [
    {
      title: 'Organizations',
      value: formatNumber(data.total_organizations),
      icon: Building2,
    },
    {
      title: 'Coaches',
      value: formatNumber(data.total_coaches),
      icon: UserCheck,
    },
    {
      title: 'Players',
      value: formatNumber(data.total_players),
      icon: Users,
    },
    {
      title: 'Sessions',
      value: formatNumber(data.total_sessions),
      icon: Activity,
    },
    {
      title: 'Active Subscriptions',
      value: formatNumber(data.active_subscriptions),
      icon: Users,
    },
    {
      title: 'Revenue Overview',
      value: formatCurrency(data.revenue_overview),
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {isDashboardEmpty(data) && (
        <EmptyState
          title="No platform activity yet"
          description="Analytics will appear here once organizations, coaches, and players begin using the platform."
        />
      )}
    </div>
  );
}

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardData();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={
          data?.description ??
          'Platform-wide analytics and key metrics for Super Admin.'
        }
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label="Refresh dashboard data"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            Refresh
          </Button>
        }
      />

      {isLoading && <DashboardSkeleton />}

      {isError && (
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : 'Unable to load dashboard analytics.'
          }
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && data && <DashboardContent data={data} />}
    </div>
  );
}
