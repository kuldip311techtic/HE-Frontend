import { BrowserRouter } from 'react-router-dom';
import RootRoutes from './routes/__root';

export default function App() {
  return (
    <BrowserRouter>
      <RootRoutes />
    </BrowserRouter>
  );
}
