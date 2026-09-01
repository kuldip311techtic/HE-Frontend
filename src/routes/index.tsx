import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@/lib/auth-storage'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/super-admin/dashboard' })
    }
    throw redirect({ to: '/super-admin/login' })
  },
})
