import { type FormEvent, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateLoginCredentials } from '../../lib/auth/validateLogin';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function LoginForm() {
  const { login, isLoading, error, reset } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  const clearFieldError = (field: 'email' | 'password') => {
    if (field === 'email') {
      setEmailError(undefined);
    } else {
      setPasswordError(undefined);
    }

    if (error) {
      reset();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateLoginCredentials({ email, password });
    setEmailError(validationErrors.email);
    setPasswordError(validationErrors.password);

    if (validationErrors.email || validationErrors.password) {
      return;
    }

    try {
      await login({
        email: email.trim(),
        password,
      });
    } catch {
      return;
    }
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Super Admin login"
      aria-busy={isLoading}
      aria-describedby={error ? 'login-error' : undefined}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 text-sm text-muted">
          <LoadingSpinner size="sm" label="Signing in" />
          <span>Signing in…</span>
        </div>
      ) : null}

      <Input
        id="admin-email"
        label="Email"
        type="email"
        name="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        required
        value={email}
        error={emailError}
        disabled={isLoading}
        placeholder="Enter your email"
        onChange={(event) => {
          setEmail(event.target.value);
          clearFieldError('email');
        }}
      />

      <Input
        id="admin-password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        autoComplete="current-password"
        required
        value={password}
        error={passwordError}
        disabled={isLoading}
        placeholder="Enter your password"
        onChange={(event) => {
          setPassword(event.target.value);
          clearFieldError('password');
        }}
        trailingElement={
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            disabled={isLoading}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-muted transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed"
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
      />

      {error ? <ErrorMessage id="login-error" message={error} /> : null}

      <Button type="submit" loading={isLoading} loadingText="Signing in…">
        Log in
      </Button>
    </form>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a3 3 0 0 0 4.1 4.1" />
      <path d="M9.9 5.2A10.5 10.5 0 0 1 12 5c6 0 9.5 7 9.5 7a16.8 16.8 0 0 1-3.2 3.8" />
      <path d="M6.5 6.9C4.3 8.5 2.5 12 2.5 12s3.5 7 9.5 7c1.4 0 2.7-.3 3.9-.8" />
    </svg>
  );
}
