import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  CreditCard,
  LayoutGrid,
  LifeBuoy,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Skeleton } from '@/components/ui/skeleton';
import type { QuickAccessItem } from '@/types/api';

interface MappedQuickAccessItem {
  key: string;
  to: string | null;
  label: string;
  description: string;
  status: string;
  icon: LucideIcon;
}

function firstNonEmpty(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

function resolveAdminPath(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const pathname = (() => {
    if (trimmed.startsWith('/')) return trimmed.split(/[?#]/)[0];
    try {
      return new URL(trimmed).pathname;
    } catch {
      return trimmed.split(/[?#]/)[0];
    }
  })();

  return pathname.startsWith('/admin/') ? pathname : null;
}

function fallbackPathFromLabel(label: string): string | null {
  const hay = label.toLowerCase();
  if (hay.includes('organization')) return '/admin/organizations';
  if (hay.includes('user') || hay.includes('coach') || hay.includes('player')) return '/admin/users';
  if (hay.includes('subscription')) return '/admin/subscriptions';
  if (hay.includes('analytic')) return '/admin/analytics';
  if (hay.includes('support')) return '/admin/support';
  if (hay.includes('dashboard')) return '/admin/dashboard';
  return null;
}

function iconFor(to: string | null, label: string): LucideIcon {
  const hay = `${to ?? ''} ${label}`.toLowerCase();
  if (hay.includes('organization')) return Building2;
  if (hay.includes('user') || hay.includes('coach') || hay.includes('player')) return Users;
  if (hay.includes('subscription')) return CreditCard;
  if (hay.includes('analytic')) return BarChart3;
  if (hay.includes('support')) return LifeBuoy;
  return LayoutGrid;
}

function mapQuickAccessItems(items: QuickAccessItem[]): MappedQuickAccessItem[] {
  return items.map((item, index) => {
    const label = firstNonEmpty(item.label, item.name, item.module) || 'Module';
    const linkedPath = resolveAdminPath(firstNonEmpty(item.link, item.to, item.path));
    const to = linkedPath ?? fallbackPathFromLabel(firstNonEmpty(item.module, item.label, item.name, label));
    return {
      key: `${to ?? 'item'}-${label}-${index}`,
      to,
      label,
      description: firstNonEmpty(item.description) || 'Open this module.',
      status: firstNonEmpty(item.status) || (to ? 'Available' : 'Unavailable'),
      icon: iconFor(to, label),
    };
  });
}

interface QuickAccessSectionProps {
  items: QuickAccessItem[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function QuickAccessSection({
  items,
  loading = false,
  error = null,
  onRetry,
}: QuickAccessSectionProps) {
  const mapped = mapQuickAccessItems(items);

  return (
    <section aria-labelledby="quick-access-heading" className="space-y-4">
      <div>
        <h2 id="quick-access-heading" className="text-body-25 text-foreground">
          Quick Access
        </h2>
        <p className="text-body-sm text-muted-foreground">
          Shortcuts from the Super Admin quick-access API.
        </p>
      </div>
      {error ? (
        <div className="space-y-3">
          <ErrorMessage message={error} />
          {onRetry ? (
            <Button type="button" variant="outline" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="min-h-[132px] rounded-figma-10 border border-figma-border bg-card p-4"
            >
              <Skeleton className="mb-4 h-5 w-32" />
              <Skeleton className="mb-3 h-4 w-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      ) : mapped.length === 0 ? (
        <p className="text-body-sm text-muted-foreground">No quick access items are available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {mapped.map((item) => {
            const Icon = item.icon;
            const card = (
              <Card className="flex min-h-[132px] flex-col justify-between p-4 transition-colors hover:bg-muted/40 group-active:bg-muted/60">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-h-11 items-center gap-2">
                    <Icon className="h-4 w-4 text-figma-brand" aria-hidden />
                    <span className="text-body-13 text-foreground">{item.label}</span>
                  </div>
                  <Badge variant="default">{item.status}</Badge>
                </div>
                <p className="text-body-sm text-muted-foreground">{item.description}</p>
              </Card>
            );

            if (!item.to) {
              return (
                <div key={item.key} className="rounded-figma-10">
                  {card}
                </div>
              );
            }

            return (
              <NavLink
                key={item.key}
                to={item.to}
                className="group rounded-figma-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
              >
                {card}
              </NavLink>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function QuickAccessSkeleton() {
  return <QuickAccessSection items={[]} loading />;
}
