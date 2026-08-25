import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import type { ResponseFormValues } from '@/types/supportRequest';

const responseFormSchema = z.object({
  response: z
    .string()
    .min(1, 'Response is required.')
    .max(2000, 'Response must be 2000 characters or fewer.'),
});

type ResponseFormSchema = z.infer<typeof responseFormSchema>;

interface ResponseFormProps {
  initialResponse?: string | null;
  loading?: boolean;
  disabled?: boolean;
  onSubmit: (values: ResponseFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export default function ResponseForm({
  initialResponse = '',
  loading = false,
  disabled = false,
  onSubmit,
  onCancel,
}: ResponseFormProps) {
  const form = useForm<ResponseFormSchema>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      response: initialResponse ?? '',
    },
  });

  useEffect(() => {
    form.reset({ response: initialResponse ?? '' });
  }, [form, initialResponse]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        aria-label="Respond to support request"
        noValidate
      >
        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="support-response">Your Response</FormLabel>
              <FormControl>
                <Textarea
                  id="support-response"
                  placeholder="Write your response to the user..."
                  aria-label="Support request response"
                  disabled={loading || disabled}
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              aria-label="Cancel response"
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={loading || disabled}
            aria-busy={loading}
            aria-label="Send response"
          >
            {loading ? 'Sending…' : 'Send Response'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { ResponseFormValues };
