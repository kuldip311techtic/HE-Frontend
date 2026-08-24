import { getApiErrorMessage } from '../../../lib/api/errors';
import type { Organization } from '../../../types/organization';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ErrorMessage from '../../ui/ErrorMessage';
import LoadingSpinner from '../../ui/LoadingSpinner';

interface OrganizationListProps {
  organizations: Organization[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onPageChange: (page: number) => void;
  onEdit: (organization: Organization) => void;
  onRemove: (organization: Organization) => void;
  onRetry: () => void;
}

export default function OrganizationList({
  organizations,
  total,
  page,
  pageSize,
  isLoading,
  isError,
  error,
  onPageChange,
  onEdit,
  onRemove,
  onRetry,
}: OrganizationListProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  if (isLoading) {
    return (
      <div
        className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface py-12"
        role="status"
      >
        <LoadingSpinner label="Loading organizations" />
        <p className="text-sm text-muted">Loading organizations…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <ErrorMessage
          message={getApiErrorMessage(
            error,
            'Unable to load organizations. Please try again.',
          )}
        />
        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            fullWidth={false}
            className="min-w-[140px]"
            onClick={onRetry}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <EmptyState
        title="No organizations yet"
        description="Add your first organization to start managing organizational data from this dashboard."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-line">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-left">
            <caption className="sr-only">Organizations list</caption>
            <thead className="bg-accent-soft/40">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  Organization name
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  Contact email
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  Phone number
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
              {organizations.map((organization) => (
                <tr key={organization.id} className="hover:bg-accent-soft/20">
                  <td className="px-4 py-4 text-sm font-semibold text-ink sm:px-6">
                    {organization.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted sm:px-6">
                    {organization.contact_email}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted sm:px-6">
                    {organization.phone_number}
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        fullWidth={false}
                        className="min-w-[88px] px-3 py-2 text-sm hover:bg-accent-soft"
                        aria-label={`Edit ${organization.name}`}
                        onClick={() => onEdit(organization)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        fullWidth={false}
                        className="min-w-[96px] px-3 py-2 text-sm"
                        aria-label={`Remove ${organization.name}`}
                        onClick={() => onRemove(organization)}
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
