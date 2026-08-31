import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { TextInput } from '@/components/TextInput';
import { useLogin } from '@/hooks/useLogin';
import { isValidEmail } from '@/lib/utils';

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const { login, isLoading, error, clearError } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  function validateForm(): FormErrors {
    const errors: FormErrors = {};

    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!isValidEmail(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    const errors = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    await login({
      email: email.trim(),
      password,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
      aria-label="Super Admin login form"
    >
      <TextInput
        id="email"
        name="email"
        type="email"
        label="Email"
        autoComplete="email"
        placeholder="admin@example.com"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (fieldErrors.email) {
            setFieldErrors((prev) => ({ ...prev, email: undefined }));
          }
          if (error) clearError();
        }}
        error={fieldErrors.email}
        disabled={isLoading}
        required
      />

      <TextInput
        id="password"
        name="password"
        type="password"
        label="Password"
        autoComplete="current-password"
        placeholder="Enter your password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          if (fieldErrors.password) {
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }
          if (error) clearError();
        }}
        error={fieldErrors.password}
        disabled={isLoading}
        required
      />

      {error ? <ErrorMessage message={error} /> : null}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          'Log in'
        )}
      </Button>
    </form>
  );
}
