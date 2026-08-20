import { getApiErrorMessage } from '../../../lib/api/errors';
import { formatUserRole, type User } from '../../../types/user';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ErrorMessage from '../../ui/ErrorMessage';
import LoadingSpinner from '../../ui/LoadingSpinner';

interface UserListProps {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onRemove: (user: User) => void;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const toneClass =
    normalized === 'active'
      ? 'bg-success/10 text-success'
      : normalized === 'inactive'
        ? 'bg-danger-soft text-danger'
        : 'bg-accent-soft text-warning';

  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-semibold uppercase tracking-wide ${toneClass}`}
    >
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex min-h-8 items-center rounded-full bg-accent-soft px-3 text-xs font-semibold text-ink">
      {formatUserRole(role)}
    </span>
  );
}

export default function UserList({
  users,
  total,
  page,
  pageSize,
  isLoading,
  isError,
  error,
  onPageChange,
  onEdit,
  onRemove,
}: UserListProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  if (isLoading) {
    return (
      <div
        className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface py-12"
        role="status"
      >
        <LoadingSpinner label="Loading users" />
        <p className="text-sm text-muted">Loading users…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        message={getApiErrorMessage(
          error,
          'Unable to load users. Please try again.',
        )}
      />
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        title="No users yet"
        description="Add your first user to start managing accounts and role assignments from this dashboard."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-line">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-left">
            <caption className="sr-only">Users list</caption>
            <thead className="bg-accent-soft/40">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  User Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  Email Address
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-accent-soft/20">
                  <td className="px-4 py-4 sm:px-6">
                    <p
                      className="max-w-[120px] truncate font-mono text-xs text-muted sm:max-w-[160px]"
                      title={user.id}
                    >
                      {user.id}
                    </p>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="min-w-[140px]">
                      <p className="font-semibold text-ink">
                        {user.name ||
                          `${user.first_name} ${user.last_name}`.trim()}
                      </p>
                      {(user.first_name || user.last_name) && user.name ? (
                        <p className="mt-1 text-xs text-muted">
                          {user.first_name} {user.last_name}
                        </p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-muted sm:px-6">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        fullWidth={false}
                        className="min-w-[88px] px-3 py-2 text-sm"
                        aria-label={`Edit ${user.name || user.email}`}
                        onClick={() => onEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        fullWidth={false}
                        className="min-w-[96px] px-3 py-2 text-sm"
                        aria-label={`Remove ${user.name || user.email}`}
                        onClick={() => onRemove(user)}
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Showing {start}-{end} of {total}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            fullWidth={false}
            className="min-w-[100px] px-3 py-2 text-sm"
            disabled={page <= 1}
            aria-label="Previous page"
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="min-w-[80px] text-center text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="ghost"
            fullWidth={false}
            className="min-w-[100px] px-3 py-2 text-sm"
            disabled={page >= totalPages}
            aria-label="Next page"
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
