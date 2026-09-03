import * as React from 'react';
import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface DialogA11yContextValue {
  registerTitleId: (id: string) => void;
  unregisterTitleId: () => void;
  registerDescriptionId: (id: string) => void;
  unregisterDescriptionId: () => void;
}

const DialogA11yContext = createContext<DialogA11yContextValue | null>(null);

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  titleId?: string;
  descriptionId?: string;
}

export function Dialog({
  open,
  onOpenChange,
  children,
  className,
  titleId: titleIdProp,
  descriptionId: descriptionIdProp,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const [registeredTitleId, setRegisteredTitleId] = useState<string | undefined>();
  const [registeredDescriptionId, setRegisteredDescriptionId] = useState<string | undefined>();

  const a11yContextValue = React.useMemo<DialogA11yContextValue>(
    () => ({
      registerTitleId: (id) => setRegisteredTitleId(id),
      unregisterTitleId: () => setRegisteredTitleId(undefined),
      registerDescriptionId: (id) => setRegisteredDescriptionId(id),
      unregisterDescriptionId: () => setRegisteredDescriptionId(undefined),
    }),
    [],
  );

  const titleId = titleIdProp ?? registeredTitleId;
  const descriptionId = descriptionIdProp ?? registeredDescriptionId;

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
    <DialogA11yContext.Provider value={a11yContextValue}>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
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
    </DialogA11yContext.Provider>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-[10px] border-b border-border px-6 py-5', className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  id: idProp,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const a11y = useContext(DialogA11yContext);

  useEffect(() => {
    if (!a11y || idProp) return;
    a11y.registerTitleId(id);
    return () => a11y.unregisterTitleId();
  }, [a11y, id, idProp]);

  return (
    <h2 id={id} className={cn('font-outfit text-body-25 text-foreground', className)} {...props} />
  );
}

export function DialogDescription({
  className,
  id: idProp,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const a11y = useContext(DialogA11yContext);

  useEffect(() => {
    if (!a11y || idProp) return;
    a11y.registerDescriptionId(id);
    return () => a11y.unregisterDescriptionId();
  }, [a11y, id, idProp]);

  return (
    <p
      id={id}
      className={cn('font-outfit text-body-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-5', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-3 border-t border-border px-6 py-4 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}
