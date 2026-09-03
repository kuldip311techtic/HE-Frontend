import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/api/get-api-error-message';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setValidationError('Email and password are required.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      await loginWithCredentials(email.trim(), password);
      toast.success('Signed in successfully.');
      navigate('/admin', { replace: true });
    } catch (error) {
      setValidationError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page login-bg-glow flex min-h-screen items-center justify-center px-[24px] py-[32px]">
      <Card className="login-card w-full max-w-[440px] rounded-[10px] border shadow-none">
        <CardHeader className="flex flex-col gap-[12px] px-[24px] pb-0 pt-[32px]">
          <h1 className="login-card-title">Admin Sign In</h1>
          <CardDescription className="login-card-description">
            Sign in with your Super Admin credentials to access the Hoops Engine admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-[24px] pb-[32px] pt-[20px]">
          <form className="flex flex-col gap-[20px]" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-[12px]">
              <Label htmlFor="email" className="login-field-label">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setValidationError(null);
                }}
                className="login-field-input"
                aria-invalid={Boolean(validationError)}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-[12px]">
              <Label htmlFor="password" className="login-field-label">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setValidationError(null);
                }}
                className="login-field-input"
                aria-invalid={Boolean(validationError)}
                disabled={isSubmitting}
              />
            </div>

            {validationError ? (
              <p id="login-error" className="login-error-text" role="alert" aria-live="polite">
                {validationError}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="ghost"
              className="login-submit-btn h-[44px] w-full rounded-[10px]"
              isLoading={isSubmitting}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
