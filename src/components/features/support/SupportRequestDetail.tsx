import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { DetailFields } from '@/components/features/shared/DetailFields';
import { SupportResponseForm } from '@/components/features/support/SupportResponseForm';
import { SUPPORT_MUTATIONS_UNAVAILABLE } from '@/components/features/support/supportCopy';
import { getAttachmentLabel, getAttachmentUrl } from '@/lib/utils/attachment';
import { formatDateTime } from '@/lib/utils/format';
import type { SupportRequestItem } from '@/types/support';

interface SupportRequestDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: SupportRequestItem | null;
}

export function SupportRequestDetail({ open, onOpenChange, request }: SupportRequestDetailProps) {
  const attachmentUrl = request ? getAttachmentUrl(request.attachment) : null;
  const attachmentText = request ? getAttachmentLabel(request.attachment) : 'None';

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={request?.subject ?? 'Support request'}
      description="Review the inquiry and the response form. Sending a reply or closing the request is not available in the live API."
      className="max-w-2xl"
      footer={
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Done
        </Button>
      }
    >
      {request ? (
        <div className="space-y-6">
          <DetailFields
            sections={[
              {
                title: 'Requester',
                fields: [
                  { label: 'Name', value: request.name },
                  { label: 'Email', value: request.email },
                  { label: 'Created at', value: formatDateTime(request.created_at) },
                ],
              },
              {
                title: 'Inquiry',
                fields: [
                  { label: 'Subject', value: request.subject },
                  {
                    label: 'Attachment',
                    value: attachmentUrl ? (
                      <a
                        href={attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-figma-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
                      >
                        {attachmentText}
                      </a>
                    ) : (
                      attachmentText
                    ),
                  },
                ],
              },
            ]}
          />
          <section className="space-y-2">
            <h3 className="text-body-13 text-foreground">Message</h3>
            <p className="whitespace-pre-wrap break-words text-body-21 text-foreground">
              {request.message || '—'}
            </p>
          </section>
          <section className="space-y-3">
            <h3 className="text-body-13 text-foreground">Respond</h3>
            <SupportResponseForm key={request.id} />
          </section>
        </div>
      ) : (
        <p className="text-body-sm text-muted-foreground">{SUPPORT_MUTATIONS_UNAVAILABLE}</p>
      )}
    </Dialog>
  );
}
