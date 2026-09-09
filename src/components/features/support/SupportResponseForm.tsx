import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useRespondToSupportRequest } from '@/hooks/useSupportRequests';
import { applyApiFieldErrors, getApiErrorMessage } from '@/lib/api/getApiErrorMessage';

const responseSchema = z.object({
  response: z.string().min(1, 'A response is required.'),
});

type ResponseFormValues = z.infer<typeof responseSchema>;

interface SupportResponseFormProps {
  requestId: string;
  onResponded?: () => void;
  onCloseRequest: () => void;
  isClosing?: boolean;
}

export function SupportResponseForm({
  requestId,
  onResponded,
  onCloseRequest,
  isClosing = false,
}: SupportResponseFormProps) {
  const respondMutation = useRespondToSupportRequest();
  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    mode: 'onTouched',
    defaultValues: { response: '' },
  });

  const isBusy = respondMutation.isPending || isClosing;

  const onSubmit = async (values: ResponseFormValues) => {
    try {
      const result = await respondMutation.mutateAsync({
        request_id: requestId,
        response: values.response,
      });
      toast.success(result.message || 'Response sent.');
      form.reset({ response: '' });
      onResponded?.();
    } catch (error) {
      applyApiFieldErrors(error, form.setError);
      toast.error(getApiErrorMessage(error, 'Unable to send this response. Please try again.'));
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Write a reply to this inquiry." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="submit"
            variant="brand"
            disabled={isBusy}
            aria-busy={respondMutation.isPending}
          >
            {respondMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {respondMutation.isPending ? 'Sending…' : 'Respond'}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isBusy}
            onClick={onCloseRequest}
          >
            Close request
          </Button>
        </div>
      </form>
    </Form>
  );
}
