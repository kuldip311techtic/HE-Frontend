import {
  Building2,
  CreditCard,
  RefreshCw,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="rounded-md bg-primary/20 p-2 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
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

export function DashboardPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboardData();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Platform overview and key metrics for Super Admin."
      />

      {isLoading && <DashboardSkeleton />}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-start gap-4 py-8">
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : 'Failed to load dashboard data.'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {data && !isLoading && !isError && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <StatCard
            title="Organizations"
            value={formatNumber(data.total_organizations)}
            icon={<Building2 className="h-4 w-4" aria-hidden="true" />}
          />
          <StatCard
            title="Coaches"
            value={formatNumber(data.total_coaches)}
            icon={<UserCheck className="h-4 w-4" aria-hidden="true" />}
          />
          <StatCard
            title="Players"
            value={formatNumber(data.total_players)}
            icon={<Users className="h-4 w-4" aria-hidden="true" />}
          />
          <StatCard
            title="Sessions"
            value={formatNumber(data.total_sessions)}
            icon={<Trophy className="h-4 w-4" aria-hidden="true" />}
          />
          <StatCard
            title="Active Subscriptions"
            value={formatNumber(data.active_subscriptions)}
            icon={<CreditCard className="h-4 w-4" aria-hidden="true" />}
          />
          <StatCard
            title="Revenue Overview"
            value={formatCurrency(data.revenue_overview)}
            icon={<CreditCard className="h-4 w-4" aria-hidden="true" />}
          />
        </div>
      )}
    </div>
  );
}
