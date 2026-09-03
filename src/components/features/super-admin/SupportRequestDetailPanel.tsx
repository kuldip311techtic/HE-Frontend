import { useEffect, useState } from "react";
import { Download, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCloseSupportRequest,
  useRespondToSupportRequest,
} from "@/hooks/useSupportRequestMutations";
import type { SupportRequest } from "@/types/api";

interface SupportRequestDetailPanelProps {
  request: SupportRequest | null;
  isLoading?: boolean;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

export function SupportRequestDetailPanel({
  request,
  isLoading = false,
}: SupportRequestDetailPanelProps) {
  const [responseText, setResponseText] = useState("");
  const [responseError, setResponseError] = useState<string | null>(null);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [locallyClosedIds, setLocallyClosedIds] = useState<Set<string>>(
    () => new Set(),
  );

  const respondMutation = useRespondToSupportRequest();
  const closeMutation = useCloseSupportRequest();

  useEffect(() => {
    setResponseText("");
    setResponseError(null);
  }, [request?.id]);

  const attachmentUrl =
    request?.attachment?.download_url ?? request?.attachment_url ?? null;
  const attachmentName = request?.attachment?.filename ?? "attachment";

  const handleSendResponse = async () => {
    if (!request) return;

    const trimmed = responseText.trim();
    if (!trimmed) {
      setResponseError("Please enter a response message.");
      return;
    }

    setResponseError(null);
    try {
      await respondMutation.mutateAsync({
        request_id: request.id,
        response: trimmed,
      });
      setResponseText("");
    } catch {
      // API errors surfaced via mutation toast handlers
    }
  };

  const handleCloseRequest = async () => {
    if (!request) return;

    try {
      await closeMutation.mutateAsync(request.id);
      setLocallyClosedIds((current) => new Set(current).add(request.id));
      setCloseDialogOpen(false);
    } catch {
      // Errors surfaced via mutation toast handlers
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <Skeleton className="h-6 w-48" aria-hidden="true" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" aria-hidden="true" />
          <Skeleton className="h-4 w-full" aria-hidden="true" />
          <Skeleton className="h-24 w-full" aria-hidden="true" />
        </CardContent>
      </Card>
    );
  }

  if (!request) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-12 text-center">
          <p className="text-body-sm text-muted-foreground">
            Select a support request to view details.
          </p>
        </CardContent>
      </Card>
    );
  }

  const isClosed =
    request.status === "closed" || locallyClosedIds.has(request.id);
  const isRespondPending = respondMutation.isPending;
  const isClosePending = closeMutation.isPending;

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="font-outfit text-body-25 text-foreground">
            {request.subject}
          </CardTitle>
          <p className="text-body-sm text-muted-foreground">
            From {request.name} · {request.email}
          </p>
          <p className="font-lato text-body-sm text-muted-foreground">
            Submitted {formatDate(request.created_at)}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-lato text-body-5 text-muted-foreground">Message</h3>
            <p className="mt-2 whitespace-pre-wrap text-body-21 text-foreground">
              {request.message}
            </p>
          </div>

          {attachmentUrl && (
            <div>
              <h3 className="font-lato text-body-5 text-muted-foreground">
                Attachment
              </h3>
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={attachmentName}
                className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-md text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Paperclip className="h-4 w-4" aria-hidden="true" />
                Download {attachmentName}
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          )}

          <div
            className="rounded-lg border border-border bg-muted/30 p-4"
            aria-labelledby="support-response-heading"
          >
            <h3
              id="support-response-heading"
              className="font-outfit text-body-13 text-foreground"
            >
              Respond
            </h3>
            <div className="mt-3 space-y-2">
              <Label htmlFor="support-response-text">Response message</Label>
              <Textarea
                id="support-response-text"
                rows={4}
                placeholder="Type your response…"
                value={responseText}
                onChange={(event) => {
                  setResponseText(event.target.value);
                  if (responseError) setResponseError(null);
                }}
                disabled={isClosed || isRespondPending || isClosePending}
                aria-invalid={responseError ? true : undefined}
                aria-describedby={
                  responseError ? "support-response-error" : undefined
                }
              />
              {responseError && (
                <p
                  id="support-response-error"
                  className="text-body-sm text-destructive"
                  role="alert"
                >
                  {responseError}
                </p>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => void handleSendResponse()}
                isLoading={isRespondPending}
                disabled={
                  isClosed || isRespondPending || isClosePending || !responseText.trim()
                }
                className="min-h-11"
              >
                Send response
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCloseDialogOpen(true)}
                disabled={isClosed || isRespondPending || isClosePending}
                className="min-h-11"
              >
                Close request
              </Button>
            </div>
            {isClosed && (
              <p className="mt-2 text-body-sm text-muted-foreground" role="status">
                This request is closed.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={closeDialogOpen}
        onOpenChange={setCloseDialogOpen}
        title="Close support request?"
        description={`This will mark "${request.subject}" as closed. You can still view the request details.`}
        confirmLabel="Close request"
        variant="destructive"
        isLoading={isClosePending}
        onConfirm={() => void handleCloseRequest()}
      />
    </>
  );
}
