import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    .min(10, "Please enter a response of at least 10 characters."),
});

export type SupportRequestResponseFormValues = z.infer<typeof responseSchema>;

interface SupportRequestResponseFormProps {
  formId: string;
  disabled?: boolean;
  onSubmit: (values: SupportRequestResponseFormValues) => void;
}

const textareaClassName = cn(
  "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
  "ring-offset-background placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

export function SupportRequestResponseForm({
  formId,
  disabled = false,
  onSubmit,
}: SupportRequestResponseFormProps) {
  const form = useForm<SupportRequestResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: { response: "" },
  });

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-[12px]"
      >
        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your response</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  disabled={disabled}
                  rows={5}
                  placeholder="Write a reply to send to the user…"
                  className={textareaClassName}
                  aria-label="Support response"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
