import { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminUser, RoleOption } from "@/types/api";

const createSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.string().min(1, "Please select a role."),
});

const editSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .optional()
    .or(z.literal("")),
  role: z.string().min(1, "Please select a role."),
});

export type UserFormValues = z.infer<typeof createSchema>;

interface UserFormProps {
  mode: "create" | "edit";
  user?: AdminUser | null;
  roleOptions: RoleOption[];
  onSubmit: (values: UserFormValues) => void;
  formId: string;
}

export function UserForm({
  mode,
  user,
  roleOptions,
  onSubmit,
  formId,
}: UserFormProps) {
  const schema = mode === "create" ? createSchema : editSchema;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: roleOptions[0]?.value ?? "coach",
    },
  });

  useEffect(() => {
    if (mode === "edit" && user) {
      form.reset({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        email: user.email,
        password: "",
        role: user.role,
      });
    }
  }, [form, mode, user]);

  useEffect(() => {
    if (mode === "create" && roleOptions.length > 0 && !form.getValues("role")) {
      form.setValue("role", roleOptions[0].value);
    }
  }, [form, mode, roleOptions]);

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-[16px]"
      >
        <div className="grid gap-[16px] sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" autoComplete="given-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" autoComplete="family-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {mode === "create" ? "Password" : "New password (optional)"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={
                    mode === "create" ? "Enter password" : "Leave blank to keep current"
                  }
                  autoComplete={mode === "create" ? "new-password" : "off"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
