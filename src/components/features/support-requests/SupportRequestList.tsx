import { getApiErrorMessage } from '../../../lib/api/errors';
import type { SupportRequest } from '../../../types/supportRequest';
import Button from '../../ui/Button';
import EmptyState from '../../ui/EmptyState';
import ErrorMessage from '../../ui/ErrorMessage';
import LoadingSpinner from '../../ui/LoadingSpinner';

interface SupportRequestListProps {
  supportRequests: SupportRequest[];
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onPageChange: (page: number) => void;
  onRespond: (supportRequest: SupportRequest) => void;
  onClose: (supportRequest: SupportRequest) => void;
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const toneClass =
    normalized === 'open' || normalized === 'pending'
      ? 'bg-accent-soft text-warning'
      : normalized === 'closed'
        ? 'bg-success/10 text-success'
        : normalized === 'resolved'
          ? 'bg-success/10 text-success'
          : 'bg-danger-soft text-danger';

  return (
    <span
      className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-semibold uppercase tracking-wide ${toneClass}`}
    >
      {status}
    </span>
  );
}

function formatSubmittedDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function isRequestClosed(status: string): boolean {
  const normalized = status.toLowerCase();
  return normalized === 'closed' || normalized === 'resolved';
}

export default function SupportRequestList({
  supportRequests,
  total,
  page,
  pageSize,
  isLoading,
  isError,
  error,
  onPageChange,
  onRespond,
  onClose,
}: SupportRequestListProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  if (isLoading) {
    return (
      <div
        className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-surface py-12"
        role="status"
      >
        <LoadingSpinner label="Loading support requests" />
        <p className="text-sm text-muted">Loading support requests…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorMessage
        message={getApiErrorMessage(
          error,
          'Unable to load support requests. Please try again.',
        )}
      />
    );
  }

  if (supportRequests.length === 0) {
    return (
      <EmptyState
        title="No support requests"
        description="User support inquiries will appear here when submitted."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-line">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-line text-left">
            <caption className="sr-only">Support requests list</caption>
            <thead className="bg-accent-soft/40">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  Request
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6"
                >
                  Submitted
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
              {supportRequests.map((supportRequest) => {
                const closed = isRequestClosed(supportRequest.status);
                const displayName =
                  supportRequest.user_name || supportRequest.name;
                const requestText =
                  supportRequest.request || supportRequest.description;

                return (
                  <tr
                    key={supportRequest.id}
                    className="hover:bg-accent-soft/20"
                  >
                    <td className="px-4 py-4 sm:px-6">
                      <div className="min-w-[140px]">
                        <p className="font-semibold text-ink">{displayName}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <p className="max-w-xs truncate text-sm text-muted">
                        {requestText}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted sm:px-6">
                      <time dateTime={supportRequest.submitted_at}>
                        {formatSubmittedDate(supportRequest.submitted_at)}
                      </time>
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <StatusBadge status={supportRequest.status} />
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          fullWidth={false}
                          className="min-w-[96px] px-3 py-2 text-sm"
                          aria-label={`Respond to support request from ${displayName}`}
                          disabled={closed}
                          onClick={() => onRespond(supportRequest)}
                        >
                          Respond
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          fullWidth={false}
                          className="min-w-[96px] px-3 py-2 text-sm"
                          aria-label={`Close support request from ${displayName}`}
                          disabled={closed}
                          onClick={() => onClose(supportRequest)}
                        >
                          Close
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
