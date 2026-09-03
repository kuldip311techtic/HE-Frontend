import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ContractRoutePrefetch } from '@/components/bootstrap/ContractRoutePrefetch';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AdminAuthProvider } from '@/lib/auth/AdminAuthProvider';
import { AppRoutes } from '@/routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AdminAuthProvider>
            <ContractRoutePrefetch />
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                classNames: {
                  toast: 'font-outfit bg-card text-foreground border-border',
                  success: 'border-primary/30',
                  error: 'border-destructive/30',
                },
              }}
            />
          </AdminAuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
