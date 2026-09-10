import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { SUPPORT_ACTIONS_UNAVAILABLE } from '@/hooks/useSupportRequests';
import { displayText, formatDateTime } from '@/lib/format';
import type { SupportRequestItem } from '@/types/api';

const responseSchema = z.object({
  response: z.string().trim().min(1, 'Response is required.'),
});

type ResponseFormValues = z.infer<typeof responseSchema>;

interface SupportRequestDetailDialogProps {
  request: SupportRequestItem | null;
  onOpenChange: (open: boolean) => void;
  isResponding: boolean;
  isClosing: boolean;
  actionError: string | null;
  onRespond: (response: string) => Promise<void>;
  onCloseRequest: () => void;
}

export function SupportRequestDetailDialog({
  request,
  onOpenChange,
  isResponding,
  isClosing,
  actionError,
  onRespond,
  onCloseRequest,
}: SupportRequestDetailDialogProps) {
  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: { response: '' },
  });

  useEffect(() => {
    form.reset({ response: '' });
  }, [request, form]);

  const busy = isResponding || isClosing;

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

            <Form {...form}>
              <form
                id="support-response-form"
                className="space-y-3"
                onSubmit={form.handleSubmit(async (values) => {
                  await onRespond(values.response);
                })}
                noValidate
              >
                <FormField
                  control={form.control}
                  name="response"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response</FormLabel>
                      <FormControl>
                        <Textarea
                          id="support-response"
                          placeholder="Write A Response"
                          disabled={busy}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <p id="support-actions-help" className="text-sm text-muted-foreground">
              {SUPPORT_ACTIONS_UNAVAILABLE}
            </p>
            {actionError ? <ErrorMessage message={actionError} /> : null}
          </div>
        ) : null}
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onCloseRequest}
            disabled={busy}
            aria-busy={isClosing}
            aria-describedby="support-actions-help"
          >
            {isClosing ? 'Closing…' : 'Close Request'}
          </Button>
          <Button
            type="submit"
            form="support-response-form"
            disabled={busy}
            aria-busy={isResponding}
            aria-describedby="support-actions-help"
          >
            {isResponding ? 'Responding…' : 'Respond'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
