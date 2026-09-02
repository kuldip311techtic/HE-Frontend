import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/PageHeader';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/lib/api/errors';
import { getOrganizationProfile } from '@/lib/api/services';

export function OrganizationPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['organization', 'profile'],
    queryFn: getOrganizationProfile,
  });

  const profile = data?.profile;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Profile"
        description="View your organization's profile information."
      />

      {isError && (
        <div className="space-y-3">
          <ErrorMessage
            message={getApiErrorMessage(
              error,
              'Unable to load organization profile. Please try again.',
            )}
          />
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingIndicator label="Loading profile…" />
        </div>
      )}

      {!isLoading && !isError && profile && (
        <Card>
          <CardHeader>
            <CardTitle>{profile.organization_name}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Contact Name</p>
              <p className="text-sm font-medium">
                {profile.first_name} {profile.last_name}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contact Info</p>
              <p className="text-sm font-medium">
                {profile.contact_info || '—'}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm font-medium">
                {profile.description || '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
