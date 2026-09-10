import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
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
import { titleCase } from '@/lib/utils';
import type { SupportRequest } from '@/types/api';

const schema = z.object({
  response: z.string().min(1, 'Response is required.'),
});

type FormValues = z.infer<typeof schema>;

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

function formatRequestDate(value: string | undefined): string {
  if (!value) {
    return '—';
  }
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    return value;
  }
  return dateFormatter.format(parsed);
}

interface SupportRequestDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: SupportRequest | null;
  onRespond: (requestId: string, response: string) => Promise<void>;
  onClose: (id: string) => Promise<void>;
}

export function SupportRequestDetailDialog({
  open,
  onOpenChange,
  request,
  onRespond,
  onClose,
}: SupportRequestDetailDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { response: '' },
  });

  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open) {
      form.reset({ response: '' });
    }
  }, [open, request, form]);

  if (!request) {
    return null;
  }

  const submitter = request.user ?? request.name ?? request.email ?? 'Unknown User';
  const date = formatRequestDate(request.request_date ?? request.created_at);
  const isClosed = request.status?.toLowerCase() === 'closed';
  const inquiryText =
    request.message_description ?? request.message ?? request.inquiry_subject ?? '—';

  const handleRespond = async (values: FormValues) => {
    const id = request.request_id ?? request.id;
    await onRespond(id, values.response);
    onOpenChange(false);
  };

  const handleCloseConfirm = async () => {
    setIsClosing(true);
    try {
      await onClose(request.id);
      setCloseConfirmOpen(false);
      onOpenChange(false);
    } finally {
      setIsClosing(false);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Support Request Details</DialogTitle>
            <DialogDescription>
              Review the inquiry and send a response to the user.
            </DialogDescription>
          </DialogHeader>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-foreground">User</dt>
              <dd className="text-muted-foreground">{submitter}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Request Date</dt>
              <dd className="text-muted-foreground">{date}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Status</dt>
              <dd className="text-muted-foreground">{titleCase(request.status ?? 'Open')}</dd>
            </div>
            {(request.inquiry_subject ?? request.message) && (
              <div>
                <dt className="font-medium text-foreground">Subject</dt>
                <dd className="text-muted-foreground">
                  {request.inquiry_subject ?? request.message}
                </dd>
              </div>
            )}
            <div>
              <dt className="font-medium text-foreground">Inquiry</dt>
              <dd className="whitespace-pre-wrap text-muted-foreground">{inquiryText}</dd>
            </div>
          </dl>
          {!isClosed ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRespond)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="response"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Enter Your Response"
                          disabled={isSubmitting || isClosing}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting || isClosing}
                    onClick={() => setCloseConfirmOpen(true)}
                  >
                    Close Request
                  </Button>
                  <Button type="submit" disabled={isSubmitting || isClosing} aria-busy={isSubmitting}>
                    {isSubmitting ? 'Submitting…' : 'Send Response'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={closeConfirmOpen}
        onOpenChange={setCloseConfirmOpen}
        title="Close Support Request?"
        description="This will mark the support request as closed. The user will no longer receive further responses on this inquiry. This action cannot be undone."
        confirmLabel="Close Request"
        variant="destructive"
        isLoading={isClosing}
        onConfirm={() => void handleCloseConfirm()}
      />
    </>
  );
}
