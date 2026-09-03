import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { useQuickAccess } from '@/hooks/useQuickAccess';
import {
  QUICK_ACCESS_STATIC_LINKS,
  getQuickAccessStatus,
  normalizeAdminRoute,
  resolveQuickAccessDescription,
  resolveQuickAccessIcon,
} from '@/lib/navigation/admin-routes';
import { getApiErrorMessage } from '@/lib/utils/errors';
import { QuickAccessLinkCard, QuickAccessRetryButton } from './QuickAccessLinkCard';

const SKELETON_COUNT = QUICK_ACCESS_STATIC_LINKS.length;

export function QuickAccessNav() {
  const { data, isLoading, isError, error, refetch, isFetching, isSuccess } = useQuickAccess();

  const apiLinks = useMemo(() => {
    if (!isSuccess || !data?.length) return null;

    return data.map((item) => {
      const targetPath = normalizeAdminRoute(item.link);
      return {
        module: item.module,
        description: resolveQuickAccessDescription(item.module),
        icon: resolveQuickAccessIcon(item.module),
        href: targetPath,
        status: getQuickAccessStatus(targetPath),
      };
    });
  }, [data, isSuccess]);

  const fallbackLinks = useMemo(
    () =>
      QUICK_ACCESS_STATIC_LINKS.map((item) => ({
        module: item.module,
        description: item.description,
        icon: item.icon,
        href: item.targetPath,
        status: getQuickAccessStatus(item.targetPath),
      })),
    [],
  );

  const links = apiLinks ?? (isError ? fallbackLinks : null);

  return (
    <section aria-labelledby="quick-access-heading" className="quick-access-section">
      <div className="quick-access-section__header">
        <div>
          <h3 id="quick-access-heading" className="quick-access-section__title">
            Quick Access
          </h3>
          <p className="quick-access-section__subtitle">
            Jump to core Super Admin modules.
          </p>
        </div>
        {isError ? (
          <QuickAccessRetryButton onRetry={() => refetch()} isRetrying={isFetching} />
        ) : null}
      </div>

      {isError ? (
        <p className="quick-access-section__status-message" role="status">
          {getApiErrorMessage(
            error,
            'Unable to load quick access links. Showing default navigation.',
          )}
        </p>
      ) : null}

      {isLoading ? (
        <div
          className="quick-access-grid"
          aria-busy="true"
          aria-label="Loading quick access links"
        >
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <Card key={index} className="quick-access-card">
              <div className="quick-access-card__header">
                <Skeleton className="h-9 w-9 rounded-[10px]" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="quick-access-card__content">
                <Skeleton className="h-4 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {isSuccess && !data?.length ? (
        <EmptyState
          title="No quick access links configured"
          description="Quick access modules will appear here once they are available from the server."
          action={
            <Button variant="outline" onClick={() => refetch()} isLoading={isFetching} disabled={isFetching}>
              {isFetching ? 'Refreshing…' : 'Refresh'}
            </Button>
          }
        />
      ) : null}

      {links && links.length > 0 ? (
        <div className="quick-access-grid">
          {links.map((link) => (
            <QuickAccessLinkCard
              key={link.module}
              module={link.module}
              description={link.description}
              icon={link.icon}
              href={link.href}
              status={link.status}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
