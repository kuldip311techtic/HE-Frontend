import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingState } from '@/components/ui/loading-state';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import { getStoredUser } from '@/lib/auth/auth-storage';
import { isAdminRole } from '@/lib/auth/roles';
import { parseLoginApiError } from '@/lib/utils/errors';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginWithCredentials, logout, isAuthenticated, user, isHydrating } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  if (isHydrating) {
    return <LoadingState message="Loading…" fullPage />;
  }

  if (isAuthenticated && isAdminRole(user)) {
    return <Navigate to="/admin" replace />;
  }

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await loginWithCredentials(email.trim(), password);
      const loggedInUser = getStoredUser();
      if (!isAdminRole(loggedInUser)) {
        logout();
        navigate('/admin/unauthorized', { replace: true });
        return;
      }
      toast.success('Signed in successfully.');
      navigate('/admin', { replace: true });
    } catch (error) {
      const parsed = parseLoginApiError(error, 'Incorrect email or password. Please try again.');
      setErrorMessage(parsed.message);
      if (parsed.fieldErrors.email) {
        setFieldErrors((prev) => ({ ...prev, email: parsed.fieldErrors.email }));
      }
      if (parsed.fieldErrors.password) {
        setFieldErrors((prev) => ({ ...prev, password: parsed.fieldErrors.password }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow" aria-hidden="true" />
      <main
        className="login-card w-full max-w-[400px] rounded-[10px] border border-figma-border bg-[var(--token-color-119)]"
        aria-labelledby="login-title"
      >
        <div className="login-card-header">
          <h1 id="login-title" className="login-card-title text-body-25 font-outfit text-foreground">
            Admin Sign In
          </h1>
          <p className="login-card-description text-body-sm font-outfit text-[var(--token-color-113)]">
            Sign in with your Super Admin credentials to access the admin panel.
          </p>
        </div>
        <div className="login-card-content">
          <form onSubmit={handleSubmit} className="login-form" noValidate aria-label="Super Admin sign in">
            <div className="login-field-group">
              <Label htmlFor="email" className="login-field-label text-body-5 font-lato text-figma-accent">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                className="login-field-input text-body-21 font-outfit rounded-[10px] border border-figma-border bg-[var(--token-color-117)] px-[14px] text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[var(--token-color-113)]"
                placeholder="admin@example.com"
              />
              {fieldErrors.email ? (
                <p id="email-error" className="login-field-error text-body-sm" role="alert">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div className="login-field-group">
              <Label htmlFor="password" className="login-field-label text-body-5 font-lato text-figma-accent">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                className="login-field-input text-body-21 font-outfit rounded-[10px] border border-figma-border bg-[var(--token-color-117)] px-[14px] text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[var(--token-color-113)]"
                placeholder="Enter your password"
              />
              {fieldErrors.password ? (
                <p id="password-error" className="login-field-error text-body-sm" role="alert">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            {errorMessage ? (
              <p id="login-form-error" className="login-field-error text-body-sm" role="alert" aria-live="polite">
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="ghost"
              className="login-submit-btn text-body-10 font-outfit h-[44px] w-full rounded-[10px] border border-figma-border bg-figma-brand text-figma-border shadow-none hover:bg-figma-brand hover:text-figma-border focus-visible:ring-0 focus-visible:ring-offset-0"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              aria-describedby={errorMessage ? 'login-form-error' : undefined}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
