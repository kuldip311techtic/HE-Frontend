import {
  formatSupportRequestDate,
  getSupportRequestStatusLabel,
  getSupportRequestSubject,
  getSupportRequestUserLabel,
} from "@/lib/support-request-helpers";
import type { SupportRequest } from "@/types/support-request";

interface SupportRequestDetailProps {
  supportRequest: SupportRequest;
}

export function SupportRequestDetail({
  supportRequest,
}: SupportRequestDetailProps) {
  const userLabel = getSupportRequestUserLabel(supportRequest);
  const subject = getSupportRequestSubject(supportRequest);

  return (
    <dl className="grid gap-4 rounded-md border bg-muted/30 p-4 text-sm sm:grid-cols-2">
      <div className="space-y-1">
        <dt className="font-medium text-muted-foreground">User</dt>
        <dd>{userLabel}</dd>
      </div>
      <div className="space-y-1">
        <dt className="font-medium text-muted-foreground">Request Date</dt>
        <dd>{formatSupportRequestDate(supportRequest.created_at)}</dd>
      </div>
      <div className="space-y-1 sm:col-span-2">
        <dt className="font-medium text-muted-foreground">Subject</dt>
        <dd>{subject}</dd>
      </div>
      <div className="space-y-1 sm:col-span-2">
        <dt className="font-medium text-muted-foreground">Status</dt>
        <dd>{getSupportRequestStatusLabel(supportRequest)}</dd>
      </div>
      <div className="space-y-1 sm:col-span-2">
        <dt className="font-medium text-muted-foreground">Message</dt>
        <dd className="whitespace-pre-wrap">{supportRequest.message}</dd>
      </div>
      {supportRequest.response && (
        <div className="space-y-1 sm:col-span-2">
          <dt className="font-medium text-muted-foreground">
            Previous Response
          </dt>
          <dd className="whitespace-pre-wrap">{supportRequest.response}</dd>
        </div>
      )}
    </dl>
  );
}
