import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Users } from 'lucide-react';

export function TeamsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teams"
        description="Manage teams within your organization."
      />
      <EmptyState
        icon={Users}
        title="No teams yet"
        description="Create your first team to organize coaches and players."
        actionLabel="Create Team"
        onAction={() => {
          /* Future: open create team dialog */
        }}
      />
    </div>
  );
}
