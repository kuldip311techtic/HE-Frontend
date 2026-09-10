import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useLogin } from '@/hooks/useLogin';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';
import { canAccessAdmin } from '@/lib/auth/roles';
import { useAuth } from '@/lib/auth/useAuth';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required.').email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/** Neon court tokens — login page only (do not restyle shared Input/Button). */
const LOGIN_FIGMA_TOKENS: React.CSSProperties = {
  ['--login-accent' as string]: '#9aa89e',
  ['--login-brand' as string]: '#b8ff3c',
  ['--login-border' as string]: '#2a3a2e',
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const emailValue = form.watch('email');
  const passwordValue = form.watch('password');
  const canSubmit = emailValue.trim().length > 0 && passwordValue.length > 0 && !loginMutation.isPending;

  React.useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });

      if (!canAccessAdmin(response.user)) {
        navigate('/admin/unauthorized', { replace: true });
        return;
      }

      login(response);
      toast.success('Signed in successfully.');
      const redirectTo =
        (location.state as { from?: string } | null)?.from ?? '/admin/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (error) {
      form.setError('root', {
        message: getApiErrorMessage(error, 'Unable to sign in. Please try again.'),
      });
    }
  };

  return (
    <div className="login-page" style={LOGIN_FIGMA_TOKENS}>
      <div className="login-bg-glow" aria-hidden />
      <div className="login-card">
        <div className="login-card-header">
          <h1 className="login-card-title">Super Admin Sign In</h1>
          <p className="login-card-description">
            Sign in with your administrator credentials to access the Hoops Engine admin console.
          </p>
        </div>
        <div className="login-card-content">
          <Form {...form}>
            <form className="login-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="login-field-group">
                    <FormLabel className="login-field-label">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="admin@example.com"
                        className="login-field-input"
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage className="login-field-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="login-field-group">
                    <FormLabel className="login-field-label">Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="login-field-input login-field-input--password"
                        disabled={loginMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage className="login-field-error" />
                  </FormItem>
                )}
              />
              {form.formState.errors.root?.message ? (
                <ErrorMessage
                  message={form.formState.errors.root.message}
                  className="login-field-error"
                />
              ) : null}
              <button
                type="submit"
                className="login-submit-btn"
                disabled={!canSubmit}
                aria-busy={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
