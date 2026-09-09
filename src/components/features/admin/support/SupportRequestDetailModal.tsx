import * as React from 'react';
import { Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate, humanizeEnum } from '@/lib/utils/format';
import type { SupportRequest } from '@/types/support';

interface SupportRequestDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: SupportRequest | null;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <dt className="font-lato text-body-sm font-medium text-figma-accent">{label}</dt>
      <dd className="whitespace-pre-wrap text-body-sm text-foreground">{value}</dd>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-body-sm font-semibold text-foreground">{title}</h3>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

export function SupportRequestDetailModal({
  open,
  onOpenChange,
  request,
}: SupportRequestDetailModalProps) {
  if (!request) return null;

  const hasAttachment = Boolean(request.attachment_url);
  const displayName = request.user || request.email || 'Support request';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{request.inquiry_subject || 'Support request'}</DialogTitle>
          <DialogDescription>
            Inquiry from {displayName}. Responses are handled via email outside this console.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <DetailSection title="Contact">
            <DetailRow label="User" value={request.user || '—'} />
            <DetailRow label="Email" value={request.email || '—'} />
          </DetailSection>
          <DetailSection title="Request">
            <DetailRow label="Request date" value={formatDate(request.request_date)} />
            <DetailRow label="Subject" value={request.inquiry_subject || '—'} />
            <DetailRow label="Message" value={request.message_description || '—'} />
            {request.status ? (
              <div className="space-y-1">
                <dt className="font-lato text-body-sm font-medium text-figma-accent">Status</dt>
                <dd>
                  <Badge variant="secondary">{humanizeEnum(request.status)}</Badge>
                </dd>
              </div>
            ) : null}
          </DetailSection>
        </div>
        {hasAttachment ? (
          <DialogFooter>
            <Button variant="outline" asChild>
              <a
                href={request.attachment_url!}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-4 w-4" />
                Download attachment
              </a>
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
