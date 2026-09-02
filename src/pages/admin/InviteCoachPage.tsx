import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { UserPlus } from 'lucide-react';

export function InviteCoachPage() {
  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Invite Coach"
        description="Send invitations to coaches to join your organization."
      />
      <EmptyState
        icon={UserPlus}
        title="Invite a coach"
        description="Use this page to invite coaches by email. Invitations will appear here once sent."
      />
    </div>
  );
}
