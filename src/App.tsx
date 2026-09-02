import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { adminRoutes } from '@/routes/admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {adminRoutes.map((route) =>
          route.children ? (
            <Route key={route.path} path={route.path} element={route.element}>
              {route.children.map((child) =>
                child.index ? (
                  <Route key="index" index element={child.element} />
                ) : (
                  <Route key={child.path} path={child.path} element={child.element} />
                ),
              )}
            </Route>
          ) : (
            <Route key={route.path} path={route.path} element={route.element} />
          ),
        )}

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
