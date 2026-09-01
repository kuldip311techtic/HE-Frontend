import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useState } from 'react'

import { CreateUserDialog } from '@/components/CreateUserDialog'
import { EmptyState } from '@/components/EmptyState'
import { ErrorMessage } from '@/components/ErrorMessage'
import { PageHeader } from '@/components/PageHeader'
import { SuperAdminLayout } from '@/components/SuperAdminLayout'
import { Button } from '@/components/ui/button'
import { UserList, UserListSkeleton } from '@/components/UserList'
import { useUsers } from '@/hooks/useUsers'
import { ApiError } from '@/services/api-client'

export const Route = createFileRoute('/super-admin/manage-users')({
  component: ManageUsersPage,
})

const PAGE_SIZE = 10

function ManageUsersPage() {
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading, isError, error, refetch, isFetching } = useUsers({
    page,
    pageSize: PAGE_SIZE,
  })

  const users = data?.items ?? []
  const pagination = data?.pagination
  const roleOptions = data?.roles
  const isEmpty = !isLoading && !isError && users.length === 0

  return (
    <SuperAdminLayout>
      <PageHeader
        title="Manage Users"
        description="View, add, edit, and remove coach and player accounts."
        action={
          <Button
            onClick={() => setCreateOpen(true)}
            className="min-h-[44px] gap-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add user
          </Button>
        }
      />

      {isLoading && <UserListSkeleton />}

      {isError && (
        <div className="space-y-4">
          <ErrorMessage
            message={
              error instanceof ApiError
                ? error.message
                : 'Failed to load users. Please try again.'
            }
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            className="min-h-[44px]"
          >
            Retry
          </Button>
        </div>
      )}

      {isEmpty && (
        <EmptyState
          title="No users yet"
          description="Get started by adding your first coach or player account."
          action={
            <Button
              onClick={() => setCreateOpen(true)}
              className="min-h-[44px] gap-2"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add user
            </Button>
          }
        />
      )}

      {!isLoading && !isError && users.length > 0 && pagination && (
        <UserList
          users={users}
          pagination={pagination}
          roleOptions={roleOptions}
          page={page}
          onPageChange={setPage}
        />
      )}

      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        roleOptions={roleOptions}
      />

      {isFetching && !isLoading && (
        <p className="sr-only" aria-live="polite">
          Refreshing user list
        </p>
      )}
    </SuperAdminLayout>
  )
}
