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
import type { ResponseFormValues } from '@/types/support-request';

const responseFormSchema = z.object({
  response: z
    .string()
    .min(1, 'Response is required.')
    .max(5000, 'Response must be 5000 characters or fewer.'),
});

interface ResponseFormProps {
  loading?: boolean;
  disabled?: boolean;
  initialResponse?: string | null;
  onSubmit: (values: ResponseFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export default function ResponseForm({
  loading = false,
  disabled = false,
  initialResponse = '',
  onSubmit,
  onCancel,
}: ResponseFormProps) {
  const form = useForm<ResponseFormValues>({
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

  const isDisabled = loading || disabled;

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
                  aria-label="Admin response to support request"
                  disabled={isDisabled}
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
              disabled={isDisabled}
              aria-label="Cancel response"
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={isDisabled}
            aria-busy={loading}
            aria-label="Submit response"
          >
            {loading ? 'Submitting…' : 'Submit Response'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { ResponseFormValues };
