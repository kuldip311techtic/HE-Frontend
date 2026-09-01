import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ErrorMessage } from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useLogin";
import { isValidEmail } from "@/lib/utils";

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const errors: FormErrors = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    if (!validate()) return;

    try {
      await login({ email: email.trim(), password });
      toast.success("Login successful");
      navigate("/super-admin/dashboard", { replace: true });
    } catch {
      // Error state handled by useLogin hook
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (error) clearError();
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (error) clearError();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4"
      noValidate
      aria-label="Super Admin login form"
    >
      {error && <ErrorMessage message={error} />}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          disabled={isLoading}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          required
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          disabled={isLoading}
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password ? "password-error" : undefined
          }
          required
        />
        {fieldErrors.password && (
          <p
            id="password-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {fieldErrors.password}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Signing in…</span>
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
