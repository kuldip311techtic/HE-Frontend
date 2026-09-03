import * as React from 'react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      if (!dialog.open) {
        dialog.showModal();
      }
      const focusable = dialog.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    } else if (dialog.open) {
      dialog.close();
      lastFocusedRef.current?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lg backdrop:bg-black/60 open:flex open:flex-col',
        className,
      )}
      onCancel={(event) => {
        event.preventDefault();
        onOpenChange(false);
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onOpenChange(false);
        }
      }}
    >
      {children}
    </dialog>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-[10px] border-b border-border px-6 py-5', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('font-outfit text-body-25 text-foreground', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('font-outfit text-body-sm text-muted-foreground', className)} {...props} />;
}

export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-5', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-3 border-t border-border px-6 py-4 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}
