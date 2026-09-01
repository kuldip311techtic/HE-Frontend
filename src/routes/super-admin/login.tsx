import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/components/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { isAuthenticated } from '@/lib/auth-storage'

export const Route = createFileRoute('/super-admin/login')({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/super-admin/dashboard' })
    }
  },
  component: SuperAdminLoginPage,
})

function SuperAdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
            <span className="text-2xl font-bold text-primary" aria-hidden="true">
              HE
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Super Admin Login
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access the Hoops Engine admin dashboard
          </p>
        </header>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Welcome back
            </CardTitle>
            <CardDescription>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
