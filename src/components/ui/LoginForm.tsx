import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

export function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError, clearLoginError } = useAuth();
  const { notify } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearLoginError();

    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    }
    setFieldErrors(nextErrors);
    if (nextErrors.email || nextErrors.password) {
      return;
    }

    try {
      const session = await login({ email: email.trim(), password });
      notify("success", "Signed in successfully.");
      navigate(session.redirectTo, { replace: true });
    } catch {
      return;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-4"
      noValidate
      aria-busy={isLoggingIn}
      aria-describedby={loginError ? "login-error" : undefined}
    >
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
        disabled={isLoggingIn}
        required
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
        disabled={isLoggingIn}
        required
      />
      {loginError ? (
        <p
          id="login-error"
          role="alert"
          className="rounded-md border border-error-border bg-error-background px-3 py-2 text-sm text-error"
        >
          {loginError}
        </p>
      ) : null}
      <Button type="submit" disabled={isLoggingIn} className="w-full">
        {isLoggingIn ? (
          <Spinner label="Logging in" className="text-white" />
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
