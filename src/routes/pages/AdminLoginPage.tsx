import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';
import { getStoredUser } from '@/lib/auth/auth-storage';
import { isAdminRole } from '@/lib/auth/roles';
import { parseApiError } from '@/lib/utils/errors';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginWithCredentials, logout, isAuthenticated, user, isHydrating } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  if (!isHydrating && isAuthenticated && isAdminRole(user)) {
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
      const parsed = parseApiError(error, 'Unable to sign in. Please try again.');
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
      <div className="login-card">
        <div className="login-card-header">
          <h1 className="login-card-title text-body-25">Admin Sign In</h1>
          <p className="login-card-description text-body-sm">
            Sign in with your Super Admin credentials to access the admin panel.
          </p>
        </div>
        <div className="login-card-content">
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-field-group">
              <Label htmlFor="email" className="login-field-label text-body-5">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.email)}
                className="login-field-input text-body-21"
                placeholder="admin@example.com"
              />
              {fieldErrors.email ? (
                <p className="login-field-error text-body-sm" role="alert">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div className="login-field-group">
              <Label htmlFor="password" className="login-field-label text-body-5">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.password)}
                className="login-field-input text-body-21"
                placeholder="Enter your password"
              />
              {fieldErrors.password ? (
                <p className="login-field-error text-body-sm" role="alert">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            {errorMessage ? (
              <p className="login-field-error text-body-sm" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <Button
              type="submit"
              variant="ghost"
              className="login-submit-btn text-body-10"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
