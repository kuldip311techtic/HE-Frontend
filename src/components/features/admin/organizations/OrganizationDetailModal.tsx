import type { RefObject } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DetailRow } from '@/components/features/admin/DetailFields';
import type { Organization } from '@/types/organization';

interface OrganizationDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function OrganizationDetailModal({
  open,
  onOpenChange,
  organization,
  returnFocusRef,
}: OrganizationDetailModalProps) {
  if (!organization) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} returnFocusRef={returnFocusRef}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{organization.name}</DialogTitle>
        </DialogHeader>
        <dl className="grid gap-4 sm:grid-cols-2">
          <DetailRow label="Name" value={organization.name} />
          <DetailRow label="Contact email" value={organization.contact_email} />
          <DetailRow label="Phone" value={organization.phone_number || '—'} />
          <DetailRow label="Join code" value={organization.join_code || '—'} />
          <DetailRow
            label="Address"
            value={organization.address || '—'}
            multiline
            className="sm:col-span-2"
          />
        </dl>
      </DialogContent>
    </Dialog>
  );
}
