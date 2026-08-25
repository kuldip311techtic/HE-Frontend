import ResponseForm from '@/components/features/support-requests/ResponseForm';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDateTime, isClosedSupportRequestStatus } from '@/lib/utils';
import type { ResponseFormValues, SupportRequest } from '@/types/supportRequest';

interface SupportRequestDetailsProps {
  request: SupportRequest;
  loading?: boolean;
  onSubmitResponse: (values: ResponseFormValues) => Promise<void> | void;
}

export default function SupportRequestDetails({
  request,
  loading = false,
  onSubmitResponse,
}: SupportRequestDetailsProps) {
  const isClosed = isClosedSupportRequestStatus(request.status);
  const requestBody = request.message || request.description;

  return (
    <div className="space-y-6">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            User
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {request.submitter_email ?? 'Unknown user'}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </dt>
          <dd className="mt-1">
            <StatusBadge status={request.status} />
          </dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Request Date
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {formatDateTime(request.created_at)}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Last Updated
          </dt>
          <dd className="mt-1 text-sm text-foreground">
            {formatDateTime(request.updated_at)}
          </dd>
        </div>

        {request.responded_at ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Responded At
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {formatDateTime(request.responded_at)}
            </dd>
          </div>
        ) : null}

        {request.closed_at ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Closed At
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {formatDateTime(request.closed_at)}
            </dd>
          </div>
        ) : null}
      </dl>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Subject</h3>
        <p className="mt-1 text-sm leading-6 text-foreground">{request.subject}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Message</h3>
        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
          {requestBody || 'No message provided.'}
        </p>
      </div>

      {request.admin_response ? (
        <div className="rounded-lg border border-border bg-muted/40 p-4">
          <h3 className="text-sm font-semibold text-foreground">
            Previous Admin Response
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {request.admin_response}
          </p>
        </div>
      ) : null}

      <div className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground">
          {isClosed ? 'Response' : 'Respond to Request'}
        </h3>
        {isClosed ? (
          <p className="mt-2 text-sm text-muted-foreground">
            This support request is closed and can no longer receive responses.
          </p>
        ) : (
          <div className="mt-4">
            <ResponseForm
              initialResponse={request.admin_response}
              loading={loading}
              disabled={isClosed}
              onSubmit={onSubmitResponse}
            />
          </div>
        )}
      </div>
    </div>
  );
}
