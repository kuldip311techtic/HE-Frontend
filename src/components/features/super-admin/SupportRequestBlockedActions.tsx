import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  SUPPORT_CLOSE_BLOCKED_NOTICE,
  SUPPORT_RESPOND_BLOCKED_NOTICE,
} from "@/lib/blocked-endpoint";

/**
 * JAW-9613: Respond/close actions stay disabled until the backend ships
 * documented POST/PUT support-request contract routes.
 */
export function SupportRequestBlockedActions() {
  return (
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
        <Label htmlFor="support-response-text" className="sr-only">
          Response message
        </Label>
        <Textarea
          id="support-response-text"
          rows={4}
          placeholder="Type your response…"
          disabled
          readOnly
          aria-disabled="true"
          aria-describedby="support-response-notice"
          className="opacity-60 disabled:cursor-not-allowed"
        />
        <p
          id="support-response-notice"
          className="text-body-sm text-muted-foreground"
          role="status"
        >
          {SUPPORT_RESPOND_BLOCKED_NOTICE}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          disabled
          aria-disabled="true"
          aria-describedby="support-response-notice"
          className="min-h-11"
        >
          Send response
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled
          aria-disabled="true"
          aria-describedby="support-close-notice"
          className="min-h-11"
        >
          Close request
        </Button>
      </div>
      <p
        id="support-close-notice"
        className="mt-2 text-body-sm text-muted-foreground"
        role="status"
      >
        {SUPPORT_CLOSE_BLOCKED_NOTICE}
      </p>
    </div>
  );
}
