import { AdminRoutes } from '@/routes/admin-routes';
import { PlayerRoleSelectionBootstrap } from '@/components/bootstrap/PlayerRoleSelectionBootstrap';

export default function App() {
  return (
    <>
      <PlayerRoleSelectionBootstrap />
      <AdminRoutes />
    </>
  );
}
