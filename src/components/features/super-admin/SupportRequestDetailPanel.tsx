import { Download, Paperclip } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SupportRequestBlockedActions } from "@/components/features/super-admin/SupportRequestBlockedActions";
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
  const attachmentUrl =
    request?.attachment?.download_url ?? request?.attachment_url ?? null;
  const attachmentName = request?.attachment?.filename ?? "attachment";

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

  return (
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

        <SupportRequestBlockedActions />
      </CardContent>
    </Card>
  );
}
