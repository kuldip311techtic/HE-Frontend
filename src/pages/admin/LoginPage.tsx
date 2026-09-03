import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import type { AdminRole } from '@/types/auth';
import { getRoleLabel } from '@/types/auth';

const ROLE_OPTIONS: AdminRole[] = [
  'super_admin',
  'organization_admin',
  'admin',
  'coach',
  'player',
];

function isLoginRole(value: string): value is AdminRole {
  return (ROLE_OPTIONS as readonly string[]).includes(value);
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<AdminRole | ''>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!role) {
      setValidationError('Please select a role before signing in.');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const allowed = await login(role);
      if (allowed) {
        toast.success('Signed in successfully.');
        navigate('/admin', { replace: true });
      } else {
        navigate('/admin/unauthorized', { replace: true });
      }
    } catch {
      setValidationError('Unable to sign in right now. Please try again.');
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
            Select a demo role to access the Hoops Engine admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-[24px] pb-[32px] pt-[20px]">
          <form className="flex flex-col gap-[20px]" onSubmit={handleSubmit} noValidate>
            <label className="flex flex-col gap-[12px]">
              <Select
                name="role"
                required
                value={role}
                onValueChange={(value) => {
                  if (isLoginRole(value)) {
                    setRole(value);
                    setValidationError(null);
                  }
                }}
              >
                <SelectGroup className="flex flex-col gap-[12px]">
                  <SelectLabel className="login-field-label py-0 pl-0 pr-0 font-medium">
                    Role
                  </SelectLabel>
                  <SelectTrigger
                    id="role"
                    className="login-field-input"
                    aria-label="Role"
                    aria-invalid={Boolean(validationError)}
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </SelectGroup>
                <SelectContent className="login-select-content">
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option} className="login-select-item">
                      {getRoleLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationError ? (
                <p className="login-error-text" role="alert">
                  {validationError}
                </p>
              ) : null}
            </label>
            <Button
              type="submit"
              variant="ghost"
              className="login-submit-btn h-[44px] w-full rounded-[10px]"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
