import {
  ArrowRight,
  Building2,
  CreditCard,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { paths } from '@/routes/paths';
import type { DashboardLink } from '@/types/dashboard';

interface ModuleLink {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
}

const CORE_MODULES: ModuleLink[] = [
  {
    label: 'Organizations',
    description: 'Manage organizations and their settings.',
    to: paths.organizations,
    icon: Building2,
  },
  {
    label: 'Coaches',
    description: 'View and manage coach accounts.',
    to: paths.coaches,
    icon: UserRound,
  },
  {
    label: 'Players',
    description: 'View and manage player accounts.',
    to: paths.players,
    icon: Users,
  },
  {
    label: 'Subscriptions',
    description: 'Manage subscription plans and billing.',
    to: paths.subscriptions,
    icon: CreditCard,
  },
];

interface NavigationLinksProps {
  apiLinks?: DashboardLink[];
  loading?: boolean;
}

function NavigationSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {CORE_MODULES.map((module) => (
        <Card key={module.to} aria-hidden="true">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-2 h-4 w-full max-w-xs" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function resolveLinkTarget(link: string): string {
  if (link.startsWith('http://') || link.startsWith('https://')) {
    return link;
  }

  if (link.startsWith('/')) {
    return link;
  }

  return `/${link}`;
}

export default function NavigationLinks({
  apiLinks = [],
  loading = false,
}: NavigationLinksProps) {
  if (loading) {
    return (
      <section aria-label="Core module navigation" aria-busy="true">
        <NavigationSkeleton />
      </section>
    );
  }

  return (
    <section aria-label="Core module navigation">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Core Modules</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Navigate to platform management areas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CORE_MODULES.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.to}
              to={module.to}
              className="group block min-h-touch rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label={`Navigate to ${module.label} module`}
            >
              <Card className="h-full transition-colors hover:border-accent/40 hover:bg-accent/5">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base">{module.label}</CardTitle>
                    <CardDescription className="mt-1">
                      {module.description}
                    </CardDescription>
                  </div>
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {apiLinks.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Quick Links
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {apiLinks.map((item) => {
              const target = resolveLinkTarget(item.link);
              const isExternal =
                target.startsWith('http://') || target.startsWith('https://');

              return (
                <li key={`${item.link}-${item.description}`}>
                  {isExternal ? (
                    <a
                      href={target}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-touch items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm transition hover:border-accent/40 hover:bg-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <span>{item.description || item.link}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      to={target}
                      className="flex min-h-touch items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm transition hover:border-accent/40 hover:bg-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <span>{item.description || item.link}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
