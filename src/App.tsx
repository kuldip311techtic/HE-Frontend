import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AdminRoutes } from '@/routes/admin';

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">HE Platform</h1>
      <p className="max-w-md text-muted-foreground">
        Welcome to the HE platform. Super Admins can access the dedicated admin
        panel to manage organizations, users, and platform analytics.
      </p>
      <a
        href="/admin"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Go to Admin Panel
      </a>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
