import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/Button'
import { ErrorMessage } from '@/components/ErrorMessage'
import { TextInput } from '@/components/TextInput'
import { useLogin } from '@/hooks/useLogin'

export function LoginForm() {
  const navigate = useNavigate()
  const { login, isLoading, error, isSuccess, clearError } = useLogin()

  useEffect(() => {
    if (isSuccess) {
      navigate('/super-admin/dashboard', { replace: true })
    }
  }, [isSuccess, navigate])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearError()

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    if (typeof email !== 'string' || typeof password !== 'string') {
      return
    }

    await login({ email: email.trim(), password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-4">
        <TextInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@example.com"
          required
          disabled={isLoading}
        />
        <TextInput
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          disabled={isLoading}
        />
      </div>

      {error && <ErrorMessage message={error} />}

      <Button
        type="submit"
        className="w-full min-h-11"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}
