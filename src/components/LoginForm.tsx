import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TextInput } from "@/components/TextInput";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useLogin";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoading, error, reset } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    reset();
    login(values);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
      aria-label="Super Admin login form"
      noValidate
    >
      {error ? <ErrorMessage message={error} /> : null}

      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            id="super-admin-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            aria-label="Email address"
            disabled={isLoading}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            id="super-admin-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-label="Password"
            disabled={isLoading}
            error={fieldState.error?.message}
          />
        )}
      />

      <Button
        type="submit"
        className="min-h-11 w-full"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <LoadingSpinner label="Signing in" />
            <span>Signing in…</span>
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
