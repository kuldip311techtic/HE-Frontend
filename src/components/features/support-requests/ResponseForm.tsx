import { type FormEvent, useEffect, useId, useState } from 'react';
import { useRespondSupportRequest } from '../../../hooks/useRespondSupportRequest';
import {
  validateResponsePayload,
  type ResponseFieldErrors,
} from '../../../lib/supportRequests/validateResponse';
import type { SupportRequest } from '../../../types/supportRequest';
import Button from '../../ui/Button';
import ErrorMessage from '../../ui/ErrorMessage';

interface ResponseFormProps {
  supportRequest: SupportRequest | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function ResponseForm({
  supportRequest,
  open,
  onClose,
  onSuccess,
}: ResponseFormProps) {
  const titleId = useId();
  const [response, setResponse] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ResponseFieldErrors>({});
  const respondMutation = useRespondSupportRequest();

  useEffect(() => {
    if (!open || !supportRequest) {
      return;
    }

    setResponse(supportRequest.response ?? '');
    setFieldErrors({});
    respondMutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset form when dialog opens
  }, [open, supportRequest?.id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supportRequest) {
      return;
    }

    const validationErrors = validateResponsePayload(response);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await respondMutation.respondSupportRequest({
        id: supportRequest.id,
        response: response.trim(),
      });
      onSuccess('Response sent successfully.');
      onClose();
    } catch {
      // API error is surfaced via respondMutation.errorMessage
    }
  };

  if (!open || !supportRequest) {
    return null;
  }

  const displayName = supportRequest.user_name || supportRequest.name;
  const requestText = supportRequest.request || supportRequest.description;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-overlay p-4 sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !respondMutation.isLoading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface p-6 shadow-card"
      >
        <h2 id={titleId} className="text-xl font-bold leading-7 text-ink">
          Respond to support request
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Send a response to {displayName}&apos;s inquiry.
        </p>

        <div className="mt-5 rounded-xl border border-line bg-accent-soft/20 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Original request
          </p>
          <p className="mt-2 text-sm leading-6 text-ink">{requestText}</p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="support-request-response"
              className="mb-2 block text-sm font-semibold leading-5 text-ink"
            >
              Response
            </label>
            <textarea
              id="support-request-response"
              name="response"
              rows={5}
              required
              value={response}
              disabled={respondMutation.isLoading}
              aria-describedby={
                fieldErrors.response ? 'support-request-response-error' : undefined
              }
              aria-invalid={Boolean(fieldErrors.response)}
              className="min-h-[140px] w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-5 text-ink outline-none transition focus:border-accent focus:shadow-focus disabled:cursor-not-allowed disabled:opacity-70"
              onChange={(event) => {
                setResponse(event.target.value);
                setFieldErrors((current) => ({
                  ...current,
                  response: undefined,
                }));
              }}
            />
            {fieldErrors.response ? (
              <p
                id="support-request-response-error"
                className="mt-1.5 text-xs leading-4 text-danger"
              >
                {fieldErrors.response}
              </p>
            ) : null}
          </div>

          {respondMutation.errorMessage ? (
            <ErrorMessage message={respondMutation.errorMessage} />
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              fullWidth={false}
              className="sm:min-w-[120px]"
              disabled={respondMutation.isLoading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              fullWidth={false}
              className="sm:min-w-[160px]"
              loading={respondMutation.isLoading}
              loadingText="Sending…"
            >
              Send response
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
