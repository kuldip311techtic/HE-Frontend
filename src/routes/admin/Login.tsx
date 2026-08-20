import { Navigate } from 'react-router-dom';
import CourtGraphic from '../../assets/CourtGraphic';
import LoginForm from '../../components/features/LoginForm';
import BrandMark from '../../components/layout/BrandMark';
import { isAuthenticated } from '../../hooks/useAuth';
import { breakpoints } from '../../theme/breakpoints';
import { paths } from '../paths';

export default function AdminLoginPage() {
  if (isAuthenticated()) {
    return <Navigate to={paths.dashboard} replace />;
  }

  return (
    <main
      className="flex min-h-screen bg-canvas font-sans text-secondary"
      data-breakpoint-mobile={breakpoints.mobile}
      data-breakpoint-tablet={breakpoints.tablet}
      data-breakpoint-desktop={breakpoints.desktop}
    >
      <section
        aria-label="Hoops Engine brand"
        className="relative hidden w-[46%] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(234,88,12,0.28),transparent_42%),radial-gradient(circle_at_90%_80%,rgba(29,78,216,0.18),transparent_36%),linear-gradient(160deg,#07111f_0%,#0b1a2e_52%,#12243c_100%)] px-12 py-16 lg:flex lg:flex-col lg:justify-between"
      >
        <div>
          <BrandMark />
          <p className="mt-16 max-w-md text-4xl font-bold leading-tight text-secondary">
            Command the Hoops Engine dashboard.
          </p>
          <p className="mt-5 max-w-md text-base leading-7 text-navy-muted">
            Super Admins sign in here to manage organizations, coaches, and
            players from one secure workspace.
          </p>
        </div>
        <CourtGraphic />
      </section>

      <section className="flex min-h-screen flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[420px] rounded-2xl bg-surface p-6 shadow-card sm:p-8">
          <div className="mb-8 lg:hidden">
            <BrandMark dark />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            Super Admin
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-8 text-ink sm:text-[32px] sm:leading-10">
            Sign in
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Enter your email and password to access the dashboard.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
