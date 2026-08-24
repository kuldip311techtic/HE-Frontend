import { BrowserRouter } from 'react-router-dom';
import RootRoutes from './__root';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <RootRoutes />
    </BrowserRouter>
  );
}
