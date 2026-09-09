import type { RefObject } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DetailRow } from '@/components/features/admin/DetailFields';
import { humanizeEnum } from '@/lib/utils/format';
import type { SuperAdminUser } from '@/types/user';

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SuperAdminUser | null;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function UserDetailModal({
  open,
  onOpenChange,
  user,
  returnFocusRef,
}: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} returnFocusRef={returnFocusRef}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{user.name}</DialogTitle>
        </DialogHeader>
        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailRow label="First name" value={user.first_name} />
          <DetailRow label="Last name" value={user.last_name} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Role" value={humanizeEnum(user.role)} />
          <DetailRow
            label="Roles"
            value={
              user.roles?.length ? (
                <span className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <Badge key={role} variant="secondary">
                      {humanizeEnum(role)}
                    </Badge>
                  ))}
                </span>
              ) : (
                '—'
              )
            }
          />
          <DetailRow label="Current account" value={user.is_self ? 'Yes' : 'No'} />
        </dl>
      </DialogContent>
    </Dialog>
  );
}
