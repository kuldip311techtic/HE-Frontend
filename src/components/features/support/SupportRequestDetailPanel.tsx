import { Download, Paperclip } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  downloadSupportRequestAttachment,
  formatAttachmentSize,
  formatSupportRequestDate,
  SUPPORT_ACTIONS_PENDING_MESSAGE,
} from '@/lib/api/support-requests';
import { getApiErrorMessage } from '@/lib/api/get-api-error-message';
import type { SupportRequestItem } from '@/types/api';

interface SupportRequestDetailPanelProps {
  request: SupportRequestItem | null;
}

export function SupportRequestDetailPanel({ request }: SupportRequestDetailPanelProps) {
  const [responseText, setResponseText] = useState('');
  const [responseError, setResponseError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!request) {
    return (
      <Card className="h-full border-border">
        <CardHeader>
          <CardTitle className="font-outfit text-body-10">Request details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-muted-foreground">
            Select a support request from the list to view details and respond.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleDownloadAttachment = async () => {
    if (!request.attachment) {
      return;
    }

    setIsDownloading(true);
    try {
      await downloadSupportRequestAttachment(request.id, request.attachment.original_name);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleResponseChange = (value: string) => {
    setResponseText(value);
    if (responseError && value.trim()) {
      setResponseError(null);
    }
  };

  const handleResponseSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!responseText.trim()) {
      setResponseError('Response message is required.');
      return;
    }

    setResponseError(null);
  };

  return (
    <Card className="h-full border-border">
      <CardHeader className="space-y-1">
        <CardTitle className="font-outfit text-body-10">{request.subject}</CardTitle>
        <p className="text-body-sm text-muted-foreground">
          {request.name} · {request.email}
        </p>
        <p className="text-body-sm text-muted-foreground">
          Submitted {formatSupportRequestDate(request.created_at)}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h3 className="font-outfit text-body-10">Message</h3>
          <p className="whitespace-pre-wrap text-body-sm leading-relaxed">{request.message}</p>
        </section>

        {request.attachment ? (
          <section className="space-y-2">
            <h3 className="font-outfit text-body-10">Attachment</h3>
            <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <p className="text-body-sm font-medium">{request.attachment.original_name}</p>
                  <p className="text-body-sm text-muted-foreground">
                    {formatAttachmentSize(request.attachment.size_bytes)}
                    {request.attachment.content_type
                      ? ` · ${request.attachment.content_type}`
                      : null}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-10 shrink-0"
                onClick={() => void handleDownloadAttachment()}
                isLoading={isDownloading}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download
              </Button>
            </div>
          </section>
        ) : null}

        <section className="space-y-4 border-t border-border pt-6">
          <div>
            <h3 className="font-outfit text-body-10">Respond to request</h3>
            <p className="mt-1 text-body-sm text-muted-foreground" role="status">
              {SUPPORT_ACTIONS_PENDING_MESSAGE}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleResponseSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="support-response">Your response</Label>
              <Textarea
                id="support-response"
                value={responseText}
                onChange={(event) => handleResponseChange(event.target.value)}
                placeholder="Write a response to the user…"
                className="min-h-[120px] resize-y"
                disabled
                aria-invalid={Boolean(responseError)}
                aria-describedby="support-response-helper"
              />
              {responseError ? (
                <p className="text-body-sm text-destructive" role="alert">
                  {responseError}
                </p>
              ) : null}
              <p id="support-response-helper" className="text-body-sm text-muted-foreground">
                Submit will be enabled once the respond API is available.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" disabled title={SUPPORT_ACTIONS_PENDING_MESSAGE}>
                Send response
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled
                title={SUPPORT_ACTIONS_PENDING_MESSAGE}
              >
                Close request
              </Button>
            </div>
          </form>
        </section>
      </CardContent>
    </Card>
  );
}
