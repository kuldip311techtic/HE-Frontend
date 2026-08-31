import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { routes } from '@/routes/__root'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <span className="text-muted-foreground">Loading…</span>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  </StrictMode>,
)
