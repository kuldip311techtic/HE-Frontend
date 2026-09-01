import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const responseSchema = z.object({
  response: z
    .string()
    .min(1, "Response is required.")
    .max(5000, "Response must be 5000 characters or fewer."),
});

export type ResponseFormValues = z.infer<typeof responseSchema>;

interface ResponseFormProps {
  onSubmit: (values: ResponseFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ResponseForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ResponseFormProps) {
  const form = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      response: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset();
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="space-y-4"
        aria-label="Respond to support request form"
        noValidate
      >
        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Response</FormLabel>
              <FormControl>
                <textarea
                  className={cn(
                    "flex min-h-[120px] w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  placeholder="Write your response to the user…"
                  disabled={isSubmitting}
                  aria-required="true"
                  aria-label="Response message"
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Sending…</span>
              </>
            ) : (
              "Send Response"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
