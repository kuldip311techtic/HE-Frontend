import { BrowserRouter } from 'react-router-dom';
import AdminRoutes from './routes/admin';

export default function App() {
  return (
    <BrowserRouter>
      <AdminRoutes />
    </BrowserRouter>
  );
}
