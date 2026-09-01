import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useLogin";
import { isValidEmail } from "@/lib/utils";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .refine(isValidEmail, "Please enter a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    clearError();

    try {
      await login({ email: values.email.trim(), password: values.password });
      toast.success("Login successful");
      navigate("/super-admin/dashboard", { replace: true });
    } catch {
      // Error state handled by useLogin hook
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="flex flex-col gap-4"
        noValidate
        aria-label="Super Admin login form"
      >
        {error && <ErrorMessage message={error} />}

        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="admin@example.com"
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid={fieldState.invalid}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    if (error) clearError();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  aria-required="true"
                  aria-invalid={fieldState.invalid}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event);
                    if (error) clearError();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                <span>Signing in…</span>
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
