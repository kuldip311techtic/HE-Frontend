import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { getOrganizationDisplayName } from '@/lib/api/organizations';
import type { OrganizationItem } from '@/types/api';

interface DeleteOrganizationDialogProps {
  organization: OrganizationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteOrganizationDialog({
  organization,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteOrganizationDialogProps) {
  const displayName = organization ? getOrganizationDisplayName(organization) : '';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove organization?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove <strong>{displayName}</strong> and its associated data
            from Hoops Engine. Coaches and players linked to this organization may lose access.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Removing…' : 'Remove organization'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
