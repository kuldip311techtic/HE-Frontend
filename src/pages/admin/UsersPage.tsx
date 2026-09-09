import * as React from 'react';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UsersTable } from '@/components/features/admin/users/UsersTable';
import { UserFormDialog } from '@/components/features/admin/users/UserFormDialog';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { useUsersList } from '@/hooks/useUsers';
import { captureReturnFocus } from '@/lib/utils/captureReturnFocus';
import type { SuperAdminUser } from '@/types/user';

const DEFAULT_LIMIT = 20;

export function UsersPage() {
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_LIMIT);
  const { data, isLoading, isError, error, refetch, isSuccess } = useUsersList({
    page,
    limit: pageSize,
  });
  const [formOpen, setFormOpen] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<SuperAdminUser | null>(null);

  const items = data?.items ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (user: SuperAdminUser) => {
    setEditTarget(user);
    setFormOpen(true);
  };

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Users"
        description="Manage coach and player accounts across the platform."
        actions={
          <Button
            type="button"
            variant="brand"
            onPointerDown={(event) => captureReturnFocus(returnFocusRef, event)}
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            Add user
          </Button>
        }
      />
      <Card>
        <CardContent className="px-6 py-4">
          <UsersTable
            items={items}
            isLoading={isLoading}
            isError={isError}
            hasLoadedData={isSuccess}
            errorMessage={isError ? getApiErrorMessage(error) : undefined}
            onRetry={() => void refetch()}
            onEdit={handleEdit}
            returnFocusRef={returnFocusRef}
            page={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            emptyAction={
              <Button
                type="button"
                variant="brand"
                onPointerDown={(event) => captureReturnFocus(returnFocusRef, event)}
                onClick={handleAdd}
              >
                <Plus className="h-4 w-4" />
                Add user
              </Button>
            }
          />
        </CardContent>
      </Card>
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editTarget}
        returnFocusRef={returnFocusRef}
      />
    </div>
  );
}
