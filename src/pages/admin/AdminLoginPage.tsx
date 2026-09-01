import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/types';

/**
 * Dev login page for admin panel access.
 * In production, this would connect to POST /api/super-admin/login.
 */
export function AdminLoginPage() {
  const { isAuthenticated, isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    const mockUser: User = {
      id: '1',
      email: email.trim(),
      first_name: 'Super',
      last_name: 'Admin',
      name: 'Super Admin',
      role: 'super_admin',
      roles: ['super_admin'],
    };

    login('dev-token-super-admin', mockUser);
    navigate('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Super Admin Sign In</CardTitle>
          <CardDescription>
            Sign in with your Super Admin credentials to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hoopsengine.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-invalid={!!error}
              />
              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
