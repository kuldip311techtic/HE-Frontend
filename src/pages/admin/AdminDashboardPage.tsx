import { useQuery } from '@tanstack/react-query';
import { Building2, Users, UserCheck, Activity } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/api/errors';
import { getOrganizationProfile } from '@/lib/api/services';

function MetricCard({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminDashboardPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['organization', 'profile'],
    queryFn: getOrganizationProfile,
  });

  const orgName = data?.profile?.organization_name ?? 'Your Organization';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome to the ${orgName} admin panel.`}
      />

      {isError && (
        <ErrorMessage
          message={getApiErrorMessage(
            error,
            'Unable to load dashboard data. Please try again.',
          )}
        />
      )}

      {isError && (
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingIndicator label="Loading dashboard…" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Organization"
              value={data?.profile?.organization_name ?? '—'}
              icon={Building2}
            />
            <MetricCard
              title="Admin Contact"
              value={
                data?.profile?.first_name
                  ? `${data.profile.first_name} ${data.profile.last_name}`
                  : '—'
              }
              icon={UserCheck}
            />
            <MetricCard title="Teams" value="—" icon={Users} />
            <MetricCard title="Active Sessions" value="—" icon={Activity} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Use the sidebar to manage your organization profile, create
                teams, and invite coaches to your program.
              </p>
              <p>
                All admin actions require an authenticated Organization Admin
                or Super Admin role.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
