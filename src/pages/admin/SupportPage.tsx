import * as React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { SupportRequestsTable } from '@/components/features/admin/support/SupportRequestsTable';
import { SupportRequestDetailModal } from '@/components/features/admin/support/SupportRequestDetailModal';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useSupportRequestsList } from '@/hooks/useSupportRequests';
import type { SupportRequest } from '@/types/support';

export function SupportPage() {
  const { data, isLoading, isError, error, refetch, isSuccess } = useSupportRequestsList();
  const [viewTarget, setViewTarget] = React.useState<SupportRequest | null>(null);

  const items = data?.items ?? [];

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Support"
        description="View support inquiries submitted by users. Responses are handled via email."
      />
      <Card>
        <CardContent className="px-6 py-4">
          <SupportRequestsTable
            items={items}
            isLoading={isLoading}
            isError={isError}
            hasLoadedData={isSuccess}
            errorMessage={isError ? getApiErrorMessage(error) : undefined}
            onRetry={() => void refetch()}
            onView={setViewTarget}
          />
        </CardContent>
      </Card>
      <SupportRequestDetailModal
        open={Boolean(viewTarget)}
        onOpenChange={(open) => !open && setViewTarget(null)}
        request={viewTarget}
      />
    </div>
  );
}
