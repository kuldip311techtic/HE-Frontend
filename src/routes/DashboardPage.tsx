import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/shared/PageHeader';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Platform overview and analytics will appear here once connected."
      />
      <EmptyState
        title="Dashboard"
        description="Analytics will appear here once connected."
      />
    </div>
  );
}
