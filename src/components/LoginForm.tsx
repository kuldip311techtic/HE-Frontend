import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { ErrorMessage } from '@/components/ErrorMessage'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getLoginErrorMessage, useLogin } from '@/hooks/useLogin'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync(values)
      toast.success('Login successful')
      await navigate({ to: '/super-admin/dashboard' })
    } catch {
      // Server errors are surfaced via loginMutation.error
    }
  })

  const serverError = loginMutation.error
    ? getLoginErrorMessage(loginMutation.error)
    : null

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
      noValidate
      aria-label="Super Admin login form"
    >
      {serverError ? (
        <ErrorMessage message={serverError} id="login-error" />
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@example.com"
          aria-label="Email address"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={loginMutation.isPending}
          {...register('email')}
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          aria-label="Password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
          disabled={loginMutation.isPending}
          {...register('password')}
        />
        {errors.password ? (
          <p
            id="password-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loginMutation.isPending}
        aria-label="Log in to Super Admin dashboard"
      >
        {loginMutation.isPending ? (
          <>
            <LoadingSpinner size="sm" label="Signing in" />
            <span>Signing in…</span>
          </>
        ) : (
          'Log in'
        )}
      </Button>
    </form>
  )
}
