import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { QuickAccessStatus } from '@/lib/navigation/admin-routes';
import { cn } from '@/lib/utils/cn';

export interface QuickAccessLinkCardProps {
  module: string;
  description: string;
  icon: LucideIcon;
  href: string | null;
  status: QuickAccessStatus;
}

export function QuickAccessLinkCard({
  module,
  description,
  icon: Icon,
  href,
  status,
}: QuickAccessLinkCardProps) {
  const isAvailable = status === 'available' && href !== null;

  const cardContent = (
    <>
      <div className="quick-access-card__header">
        <div className="flex items-start justify-between gap-[12px]">
          <div className="quick-access-card__icon">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <span
            className={cn(
              'quick-access-badge',
              isAvailable ? 'quick-access-badge--available' : 'quick-access-badge--soon',
            )}
          >
            {isAvailable ? 'Available' : 'Coming soon'}
          </span>
        </div>
        <h4 className="quick-access-card__title">{module}</h4>
        <p className="quick-access-card__description">{description}</p>
      </div>
      {isAvailable ? (
        <div className="quick-access-card__content">
          <span className="quick-access-card__link">
            Open module
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      ) : null}
    </>
  );

  if (isAvailable && href) {
    return (
      <NavLink
        to={href}
        end={href === '/admin'}
        aria-label={`Navigate to ${module}`}
        className={({ isActive }) =>
          cn('quick-access-navlink', isActive && 'quick-access-navlink--active')
        }
      >
        <Card className="quick-access-card h-full">{cardContent}</Card>
      </NavLink>
    );
  }

  return (
    <Card className="quick-access-card quick-access-card--disabled h-full" aria-disabled="true">
      {cardContent}
    </Card>
  );
}
