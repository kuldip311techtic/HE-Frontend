import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SUPPORT_ACTIONS_UNAVAILABLE } from '@/hooks/useSupportRequests';
import { displayText, formatDateTime } from '@/lib/format';
import type { SupportRequestItem } from '@/types/api';

interface SupportRequestDetailDialogProps {
  request: SupportRequestItem | null;
  onOpenChange: (open: boolean) => void;
}

export function SupportRequestDetailDialog({ request, onOpenChange }: SupportRequestDetailDialogProps) {
  return (
    <Dialog open={Boolean(request)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Support Request</DialogTitle>
          <DialogDescription>Message details for this inquiry.</DialogDescription>
        </DialogHeader>
        {request ? (
          <div className="space-y-4 text-sm">
            <dl className="grid gap-3">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd>{displayText(request.name)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{displayText(request.email)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Subject</dt>
                <dd>{displayText(request.subject)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created At</dt>
                <dd>{formatDateTime(request.created_at)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Message</dt>
                <dd className="whitespace-pre-wrap">{displayText(request.message)}</dd>
              </div>
            </dl>
            {request.attachment?.download_url ? (
              <a
                href={request.attachment.download_url}
                className="inline-flex min-h-10 items-center text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Download Attachment"
              >
                Download Attachment
                {request.attachment.original_name ? ` (${request.attachment.original_name})` : ''}
              </a>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="support-response">Response</Label>
              <Textarea id="support-response" placeholder="Write A Response" readOnly value="" />
            </div>
            <p id="support-actions-help" className="text-sm text-muted-foreground">
              {SUPPORT_ACTIONS_UNAVAILABLE}
            </p>
          </div>
        ) : null}
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            aria-disabled="true"
            aria-describedby="support-actions-help"
            className="opacity-50"
            onClick={(event) => event.preventDefault()}
          >
            Close Request
          </Button>
          <Button
            type="button"
            aria-disabled="true"
            aria-describedby="support-actions-help"
            className="opacity-50"
            onClick={(event) => event.preventDefault()}
          >
            Respond
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
