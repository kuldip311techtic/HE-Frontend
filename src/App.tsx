import { AdminRoutes } from '@/routes/admin-routes';
import { AdminApiBootstrap } from '@/components/bootstrap/AdminApiBootstrap';

export default function App() {
  return (
    <>
      <AdminApiBootstrap />
      <AdminRoutes />
    </>
  );
}
