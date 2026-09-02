import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  formatSupportRequestDate,
  getSupportRequestStatusLabel,
  getSupportRequestSubject,
  getSupportRequestUserLabel,
} from "@/lib/support-request-helpers";
import { cn } from "@/lib/utils";
import { ApiClientError } from "@/services/api-client";
import type {
  SupportRequest,
  SupportRequestFormValues,
} from "@/types/support-request";

const responseSchema = z.object({
  response: z
    .string()
    .min(1, "Response is required")
    .max(5000, "Response must be 5000 characters or less"),
});

interface SupportRequestFormProps {
  supportRequest: SupportRequest;
  onSubmit: (values: SupportRequestFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function SupportRequestForm({
  supportRequest,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: SupportRequestFormProps) {
  const form = useForm<SupportRequestFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      response: supportRequest.response ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      response: supportRequest.response ?? "",
    });
  }, [supportRequest, form]);

  const apiErrorMessage =
    error instanceof ApiClientError ? error.message : error?.message;

  const userLabel = getSupportRequestUserLabel(supportRequest);
  const subject = getSupportRequestSubject(supportRequest);

  return (
    <div className="space-y-6">
      <dl className="grid gap-4 rounded-md border bg-muted/30 p-4 text-sm sm:grid-cols-2">
        <div className="space-y-1">
          <dt className="font-medium text-muted-foreground">User</dt>
          <dd>{userLabel}</dd>
        </div>
        <div className="space-y-1">
          <dt className="font-medium text-muted-foreground">Request Date</dt>
          <dd>{formatSupportRequestDate(supportRequest.created_at)}</dd>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <dt className="font-medium text-muted-foreground">Subject</dt>
          <dd>{subject}</dd>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <dt className="font-medium text-muted-foreground">Status</dt>
          <dd>{getSupportRequestStatusLabel(supportRequest)}</dd>
        </div>
        <div className="space-y-1 sm:col-span-2">
          <dt className="font-medium text-muted-foreground">Message</dt>
          <dd className="whitespace-pre-wrap">{supportRequest.message}</dd>
        </div>
        {supportRequest.response && (
          <div className="space-y-1 sm:col-span-2">
            <dt className="font-medium text-muted-foreground">
              Previous Response
            </dt>
            <dd className="whitespace-pre-wrap">{supportRequest.response}</dd>
          </div>
        )}
      </dl>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          aria-label="Respond to support request form"
          noValidate
        >
          {apiErrorMessage && <ErrorMessage message={apiErrorMessage} />}

          <FormField
            control={form.control}
            name="response"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Response</FormLabel>
                <FormControl>
                  <textarea
                    placeholder="Enter your response to the user..."
                    disabled={isLoading}
                    aria-label="Support request response"
                    rows={5}
                    className={cn(
                      "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="min-h-11"
              aria-label="Cancel response form"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="min-h-11"
              aria-label="Submit response to support request"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner label="Submitting response" />
                  <span>Submitting…</span>
                </>
              ) : (
                "Submit response"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
