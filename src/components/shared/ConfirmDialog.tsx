import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: 'default' | 'destructive';
  errorMessage?: string | null;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isLoading = false,
  variant = 'default',
  errorMessage = null,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent>
        {errorMessage ? (
          <p className="font-outfit text-body-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </DialogContent>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={onConfirm}
          isLoading={isLoading}
          disabled={isLoading}
          aria-describedby="confirm-dialog-title"
        >
          {isLoading ? `${confirmLabel}…` : confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
