import { MessageSquare, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import ResponseForm from '@/components/features/support-requests/ResponseForm';
import StatusBadge from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime, isClosedSupportRequestStatus } from '@/lib/utils';
import type { SupportRequest } from '@/types/support-request';
import type { ResponseFormValues } from '@/types/support-request';

interface SupportRequestDetailProps {
  request: SupportRequest;
  responding?: boolean;
  closing?: boolean;
  onRespond: (values: ResponseFormValues) => Promise<void> | void;
  onClose: () => void;
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-foreground">{value}</dd>
    </div>
  );
}

export default function SupportRequestDetail({
  request,
  responding = false,
  closing = false,
  onRespond,
  onClose,
}: SupportRequestDetailProps) {
  const isClosed = isClosedSupportRequestStatus(request.status);
  const userMessage = request.message || request.description;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {request.subject}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Request ID: {request.request_id}
          </p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <DetailField
          label="User"
          value={request.submitter_email ?? 'Unknown user'}
        />
        <DetailField
          label="Request Date"
          value={formatDateTime(request.created_at)}
        />
        {request.responded_at ? (
          <DetailField
            label="Responded At"
            value={formatDateTime(request.responded_at)}
          />
        ) : null}
        {request.closed_at ? (
          <DetailField
            label="Closed At"
            value={formatDateTime(request.closed_at)}
          />
        ) : null}
      </dl>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            User Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
            {userMessage || 'No message provided.'}
          </p>
        </CardContent>
      </Card>

      {request.admin_response ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Previous Response</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
              {request.admin_response}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {!isClosed ? (
        <>
          <div className="border-t border-border" role="separator" />
          <div>
            <h3 className="mb-4 text-base font-semibold text-foreground">
              Respond to Request
            </h3>
            <ResponseForm
              loading={responding}
              initialResponse={request.admin_response}
              onSubmit={onRespond}
            />
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={closing || responding}
              aria-label="Close support request"
              className="text-destructive hover:text-destructive"
            >
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Close Request
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}
