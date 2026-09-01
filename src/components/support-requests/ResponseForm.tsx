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
import { Textarea } from "@/components/ui/textarea";
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

interface ResponseFormProps {
  supportRequest: SupportRequest;
  onSubmit: (values: SupportRequestFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function ResponseForm({
  supportRequest,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: ResponseFormProps) {
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

  useEffect(() => {
    if (error instanceof ApiClientError && error.details?.length) {
      for (const detail of error.details) {
        if (detail.field === "response") {
          form.setError("response", { message: detail.message });
        }
      }
    }
  }, [error, form]);

  const apiErrorMessage =
    error instanceof ApiClientError ? error.message : error?.message;

  return (
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
                <Textarea
                  placeholder="Enter your response to the user..."
                  disabled={isLoading}
                  aria-label="Support request response"
                  rows={5}
                  className="min-h-[120px]"
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
  );
}
