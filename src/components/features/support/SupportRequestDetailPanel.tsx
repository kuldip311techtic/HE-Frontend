import { FormEvent, useEffect, useState } from 'react';
import { SupportRequestStatusBadge } from '@/components/features/support/SupportRequestStatusBadge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { downloadSupportRequestAttachment } from '@/lib/api/support-requests';
import { parseApiError } from '@/lib/utils/errors';
import {
  displaySupportRequestMessage,
  displaySupportRequestUser,
  isSupportRequestClosed,
  resolveSupportRequestId,
  type SupportRequestItem,
} from '@/types/support-requests';

interface SupportRequestDetailPanelProps {
  request: SupportRequestItem | null;
  onRespond: (payload: { request_id: string; response: string }) => Promise<void>;
  onClose: () => void;
  isResponding?: boolean;
  isClosing?: boolean;
}

function formatDateTime(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function SupportRequestDetailPanel({
  request,
  onRespond,
  onClose,
  isResponding = false,
  isClosing = false,
}: SupportRequestDetailPanelProps) {
  const [response, setResponse] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    setResponse('');
    setFieldError(null);
    setFormError(null);
    setDownloadError(null);
  }, [request?.id]);

  if (!request) {
    return (
      <section
        aria-label="Support request details"
        className="admin-manage-panel flex min-h-[20rem] flex-col items-center justify-center border-dashed px-6 py-10 text-center"
      >
        <h3 className="font-outfit text-body-25 text-foreground">Select a support request</h3>
        <p className="mt-2 max-w-sm font-lato text-body-sm text-figma-accent">
          Choose a request from the list to view details, submit a response, or close the inquiry.
        </p>
      </section>
    );
  }

  const userLabel = displaySupportRequestUser(request);
  const inquiry = displaySupportRequestMessage(request);
  const closed = isSupportRequestClosed(request);
  const isBusy = isResponding || isClosing;
  const attachment = request.attachment;

  const validate = (): boolean => {
    const trimmed = response.trim();
    if (!trimmed) {
      setFieldError('Response is required.');
      return false;
    }
    setFieldError(null);
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    try {
      await onRespond({
        request_id: resolveSupportRequestId(request),
        response: response.trim(),
      });
      setResponse('');
    } catch (error) {
      const parsed = parseApiError(error, 'Unable to submit response. Please try again.');
      setFormError(parsed.message);
      if (parsed.fieldErrors.response) {
        setFieldError(parsed.fieldErrors.response);
      }
    }
  };

  return (
    <section aria-label="Support request details" className="admin-manage-panel min-w-0">
      <div className="admin-manage-panel__header">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="font-outfit text-body-25 text-foreground">{userLabel}</h3>
            <p className="mt-1 font-lato text-body-sm text-figma-accent">
              Submitted {formatDateTime(request.created_at)}
            </p>
          </div>
          <SupportRequestStatusBadge status={request.status} />
        </div>
      </div>

      <div className="admin-manage-panel__body space-y-5">
        {request.subject?.trim() ? (
          <div>
            <h4 className="admin-field-label">Subject</h4>
            <p className="mt-2 font-outfit text-body-sm text-foreground">{request.subject.trim()}</p>
          </div>
        ) : null}

        {request.email?.trim() ? (
          <p className="font-lato text-body-sm text-figma-accent">{request.email.trim()}</p>
        ) : null}

        <div>
          <h4 className="admin-field-label">Inquiry</h4>
          <p className="mt-2 whitespace-pre-wrap font-outfit text-body-sm text-figma-accent">
            {inquiry}
          </p>
        </div>

        {attachment?.download_url ? (
          <div>
            <h4 className="admin-field-label">Attachment</h4>
            <Button
              type="button"
              variant="outline"
              className="admin-outline-btn mt-2"
              isLoading={isDownloading}
              disabled={isDownloading}
              onClick={async () => {
                setDownloadError(null);
                setIsDownloading(true);
                try {
                  await downloadSupportRequestAttachment(
                    attachment.download_url,
                    attachment.original_name,
                  );
                } catch (error) {
                  const parsed = parseApiError(error, 'Unable to download attachment.');
                  setDownloadError(parsed.message);
                } finally {
                  setIsDownloading(false);
                }
              }}
            >
              {attachment.original_name}
            </Button>
            {downloadError ? (
              <p className="mt-2 font-outfit text-body-sm text-destructive" role="alert">
                {downloadError}
              </p>
            ) : null}
          </div>
        ) : null}

        {request.response?.trim() ? (
          <div>
            <h4 className="admin-field-label">Previous response</h4>
            <p className="mt-2 whitespace-pre-wrap rounded-[10px] border border-figma-border bg-[var(--token-color-117)] px-3 py-3 font-outfit text-body-sm text-foreground">
              {request.response.trim()}
            </p>
          </div>
        ) : null}

        {!closed ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError ? (
              <p className="font-outfit text-body-sm text-destructive" role="alert">
                {formError}
              </p>
            ) : null}

            <div className="admin-field-group">
              <Label htmlFor="support-response" className="admin-field-label">
                Your response
              </Label>
              <Textarea
                id="support-response"
                value={response}
                onChange={(event) => {
                  setResponse(event.target.value);
                  if (fieldError) setFieldError(null);
                }}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? 'support-response-error' : undefined}
                disabled={isBusy}
                placeholder="Write a response to the user's inquiry…"
                rows={5}
                className="admin-field-textarea"
              />
              {fieldError ? (
                <p
                  id="support-response-error"
                  className="font-outfit text-body-sm text-destructive"
                  role="alert"
                >
                  {fieldError}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="submit"
                isLoading={isResponding}
                disabled={isBusy}
                className="admin-primary-btn border-[#0d1612] bg-[#86d31f] text-[#0d1612]"
              >
                {isResponding ? 'Submitting…' : 'Submit response'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                isLoading={isClosing}
                disabled={isBusy}
                className="admin-outline-btn"
              >
                {isClosing ? 'Closing…' : 'Close request'}
              </Button>
            </div>
          </form>
        ) : (
          <p className="font-lato text-body-sm text-figma-accent">
            This support request is closed. No further actions are available.
          </p>
        )}
      </div>
    </section>
  );
}
