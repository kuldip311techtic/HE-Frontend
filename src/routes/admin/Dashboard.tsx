import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getStoredEmail } from '../../hooks/useAuth';
import { paths } from '../paths';

export default function AdminDashboardPage() {
  const email = getStoredEmail();

  return (
    <AdminLayout title="Dashboard">
      <section className="rounded-2xl bg-surface p-6 text-ink shadow-card sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          Super Admin
        </p>
        <h2 className="mt-2 text-3xl font-bold leading-10">Dashboard</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          You are signed in
          {email ? ` as ${email}` : ''} and can manage organizations, coaches,
          and players.
        </p>
        <div className="mt-8 max-w-xs">
          <Link
            to={paths.manageOrganizations}
            className="inline-flex min-h-touch w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-base font-semibold leading-6 text-secondary transition hover:bg-warning focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Manage organizations
          </Link>
        </div>
      </section>
    </AdminLayout>
  );
}
