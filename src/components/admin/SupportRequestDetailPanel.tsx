import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ErrorMessage } from "@/components/ui/feedback";
import {
  adminFormInputClass,
  adminFormLabelClass,
  adminOutlineButtonClass,
} from "@/lib/adminFormStyles";
import { resolveApiBaseUrl } from "@/lib/api/resolve-base-url";
import type { SupportRequestItem } from "@/types/api";
import { cn } from "@/lib/utils";

interface SupportRequestDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: SupportRequestItem | null;
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

function resolveDownloadUrl(downloadUrl: string): string {
  if (downloadUrl.startsWith("http://") || downloadUrl.startsWith("https://")) {
    return downloadUrl;
  }
  const base = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL).replace(
    /\/$/,
    "",
  );
  return `${base}${downloadUrl.startsWith("/") ? downloadUrl : `/${downloadUrl}`}`;
}

export function SupportRequestDetailPanel({
  open,
  onOpenChange,
  request,
}: SupportRequestDetailPanelProps) {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] max-w-lg overflow-y-auto rounded-[10px] border-figma-border bg-figma-background font-outfit",
        )}
      >
        <DialogHeader className="gap-[12px]">
          <DialogTitle className="font-outfit text-[18px] font-bold leading-[22.68px] tracking-[0.18px] text-white">
            {request.subject}
          </DialogTitle>
          <DialogDescription className="font-outfit text-[16px] font-normal leading-[22px] text-figma-muted">
            Submitted by {request.name} ({request.email}) on{" "}
            {formatDate(request.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-[16px]">
          <div className="space-y-[8px]">
            <h3 className="font-lato text-[16px] font-medium leading-[19.2px] text-white">
              Message
            </h3>
            <p className="whitespace-pre-wrap font-outfit text-[14px] font-normal leading-[17.64px] text-figma-muted">
              {request.message}
            </p>
          </div>

          {request.attachment && (
            <div className="space-y-[8px]">
              <h3 className="font-lato text-[16px] font-medium leading-[19.2px] text-white">
                Attachment
              </h3>
              <a
                href={resolveDownloadUrl(request.attachment.download_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-outfit text-[14px] font-medium leading-[17.64px] text-figma-bright underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
              >
                {request.attachment.original_name}
              </a>
            </div>
          )}

          <ErrorMessage
            message="Response and close actions are pending backend support."
            className="rounded-[10px] border-figma-border bg-[#1bc94f1a] text-figma-muted [&>p]:text-figma-muted"
          />

          <div className="space-y-[10px]">
            <Label htmlFor="support-response" className={adminFormLabelClass}>
              Response
            </Label>
            <textarea
              id="support-response"
              disabled
              aria-disabled="true"
              rows={4}
              placeholder="Write a response to the user…"
              className={cn(
                adminFormInputClass,
                "min-h-[100px] resize-none py-[10px]",
              )}
            />
            <p className="font-outfit text-[14px] font-normal leading-[17.64px] text-figma-muted">
              Sending responses will be enabled once the backend endpoint is
              available.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-[12px] pt-[4px] sm:gap-[12px]">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={adminOutlineButtonClass}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled
            aria-disabled="true"
            title="Close request action is pending backend support."
            className={cn(
              adminOutlineButtonClass,
              "border-[#ff6b6b]/40 text-[#ff6b6b] opacity-50",
            )}
          >
            Close request
          </Button>
          <Button
            type="button"
            disabled
            aria-disabled="true"
            title="Respond action is pending backend support."
            className="rounded-[10px] bg-figma-brand font-outfit text-[14px] font-semibold text-figma-border opacity-50 shadow-none"
          >
            Send response
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
