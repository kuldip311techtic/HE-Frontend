import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminFormInputClass,
  adminFormLabelClass,
  adminFormMessageClass,
  adminFormPrimaryButtonClass,
  adminFormSelectTriggerClass,
} from "@/lib/adminFormStyles";
import type {
  BillingFrequency,
  SubscriptionPlanItem,
  SubscriptionPlanRole,
} from "@/types/api";
import { cn } from "@/lib/utils";

const planSchema = z.object({
  name: z.string().min(1, "Plan name is required."),
  billing_frequency: z.enum(["monthly", "yearly"]),
  price_amount: z
    .string()
    .min(1, "Price is required.")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
      message: "Please enter a valid price.",
    }),
  description: z.string().optional(),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface SubscriptionPlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: SubscriptionPlanRole;
  plan?: SubscriptionPlanItem | null;
  isLoading?: boolean;
  onSubmit: (values: PlanFormValues) => void;
}

export function SubscriptionPlanFormDialog({
  open,
  onOpenChange,
  role,
  plan,
  isLoading = false,
  onSubmit,
}: SubscriptionPlanFormDialogProps) {
  const isEdit = Boolean(plan);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      billing_frequency: "monthly",
      price_amount: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: plan?.name ?? "",
        billing_frequency: (plan?.billing_frequency ?? "monthly") as BillingFrequency,
        price_amount: plan?.price_amount ?? "",
        description: plan?.description ?? "",
      });
    }
  }, [open, plan, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] max-w-lg overflow-y-auto rounded-[10px] border-figma-border bg-figma-background font-outfit",
        )}
      >
        <DialogHeader className="gap-[12px]">
          <DialogTitle className="font-outfit text-[18px] font-bold leading-[22.68px] tracking-[0.18px] text-white">
            {isEdit ? "Edit subscription plan" : "Add subscription plan"}
          </DialogTitle>
          <DialogDescription className="font-outfit text-[16px] font-normal leading-[22px] text-figma-muted">
            {isEdit
              ? "Update plan pricing and details for the selected role."
              : `Create a new ${role === "org_admin" ? "organization admin" : "coach"} subscription plan.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-[16px]"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="gap-[10px]">
                  <FormLabel className={adminFormLabelClass}>
                    Subscription name
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className={adminFormInputClass}
                      aria-label="Subscription name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={adminFormMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billing_frequency"
              render={({ field }) => (
                <FormItem className="gap-[10px]">
                  <FormLabel className={adminFormLabelClass}>Duration</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={adminFormSelectTriggerClass}
                        aria-label="Duration"
                      >
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-figma-border bg-figma-surface font-outfit">
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className={adminFormMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_amount"
              render={({ field }) => (
                <FormItem className="gap-[10px]">
                  <FormLabel className={adminFormLabelClass}>Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                      className={adminFormInputClass}
                      aria-label="Price in USD"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={adminFormMessageClass} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="gap-[10px]">
                  <FormLabel className={adminFormLabelClass}>
                    Description (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className={adminFormInputClass}
                      aria-label="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={adminFormMessageClass} />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-[12px] pt-[4px] sm:gap-[12px]">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className={cn(
                  "rounded-[10px] border-figma-border bg-transparent font-outfit text-[16px] font-medium leading-[20.16px] text-white",
                  "hover:bg-figma-accent/30 hover:text-white",
                )}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                className={adminFormPrimaryButtonClass}
                aria-busy={isLoading}
              >
                {isLoading ? "Saving…" : isEdit ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export type { PlanFormValues };
