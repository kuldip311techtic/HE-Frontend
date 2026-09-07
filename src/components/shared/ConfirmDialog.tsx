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
  dialogClassName?: string;
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
  dialogClassName,
}: ConfirmDialogProps) {
  const confirmDescribedBy = errorMessage
    ? 'confirm-dialog-description confirm-dialog-error'
    : 'confirm-dialog-description';

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      titleId="confirm-dialog-title"
      descriptionId="confirm-dialog-description"
      className={dialogClassName}
    >
      <DialogHeader className={dialogClassName?.includes('admin-form-dialog') ? 'admin-form-dialog__header border-0 px-6 py-5' : undefined}>
        <DialogTitle
          id="confirm-dialog-title"
          className={dialogClassName?.includes('admin-form-dialog') ? 'admin-form-dialog__title border-0' : undefined}
        >
          {title}
        </DialogTitle>
        <DialogDescription
          id="confirm-dialog-description"
          className={dialogClassName?.includes('admin-form-dialog') ? 'admin-form-dialog__description' : undefined}
        >
          {description}
        </DialogDescription>
      </DialogHeader>
      <DialogContent className={dialogClassName?.includes('admin-form-dialog') ? 'admin-form-dialog__content border-0 py-5' : undefined}>
        {errorMessage ? (
          <p
            id="confirm-dialog-error"
            className="font-outfit text-body-sm text-destructive"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
      </DialogContent>
      <DialogFooter className={dialogClassName?.includes('admin-form-dialog') ? 'admin-form-dialog__footer border-0' : undefined}>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
          className={dialogClassName?.includes('admin-form-dialog') ? 'admin-outline-btn' : undefined}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={onConfirm}
          isLoading={isLoading}
          disabled={isLoading}
          aria-labelledby="confirm-dialog-title"
          aria-describedby={confirmDescribedBy}
          className={
            dialogClassName?.includes('admin-form-dialog') && variant !== 'destructive'
              ? 'admin-primary-btn'
              : undefined
          }
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
