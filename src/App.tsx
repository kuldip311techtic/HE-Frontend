import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Toaster } from '@/components/ui/sonner';
import { adminRoutes } from '@/routes/admin';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {adminRoutes}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </ErrorBoundary>
  );
}
