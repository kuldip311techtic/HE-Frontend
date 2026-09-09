import * as React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OrganizationsTable } from '@/components/features/admin/organizations/OrganizationsTable';
import { OrganizationFormDialog } from '@/components/features/admin/organizations/OrganizationFormDialog';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useOrganizationsList } from '@/hooks/useOrganizations';
import { captureReturnFocus } from '@/lib/utils/captureReturnFocus';
import type { Organization } from '@/types/organization';

export function OrganizationsPage() {
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const { data, isLoading, isError, error, refetch, isSuccess } = useOrganizationsList();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Organization | null>(null);

  const items = data?.items ?? [];

  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (organization: Organization) => {
    setEditTarget(organization);
    setFormOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Organizations"
        description="Manage organizations registered on the platform."
        actions={
          <Button
            type="button"
            variant="brand"
            onPointerDown={(event) => captureReturnFocus(returnFocusRef, event)}
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            Add organization
          </Button>
        }
      />
      <Card>
        <CardContent className="px-6 py-4">
          <OrganizationsTable
            items={items}
            isLoading={isLoading}
            isError={isError}
            hasLoadedData={isSuccess}
            errorMessage={isError ? getApiErrorMessage(error) : undefined}
            onRetry={() => void refetch()}
            onEdit={handleEdit}
            returnFocusRef={returnFocusRef}
            emptyAction={
              <Button
                type="button"
                variant="brand"
                onPointerDown={(event) => captureReturnFocus(returnFocusRef, event)}
                onClick={handleAdd}
              >
                <Plus className="h-4 w-4" />
                Add organization
              </Button>
            }
          />
        </CardContent>
      </Card>
      <OrganizationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        organization={editTarget}
        returnFocusRef={returnFocusRef}
      />
    </div>
  );
}
