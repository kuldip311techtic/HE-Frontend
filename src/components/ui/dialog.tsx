import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  setTitleId: (id: string) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error('Dialog components must be used within Dialog');
  return ctx;
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, returnFocusRef, children }: DialogProps) {
  const [titleId, setTitleId] = React.useState('');
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (open) {
      previousFocusRef.current =
        returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
      return;
    }

    const focusTarget = returnFocusRef?.current ?? previousFocusRef.current;
    if (focusTarget?.isConnected) {
      focusTarget.focus();
    }
    previousFocusRef.current = null;
  }, [open, returnFocusRef]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange, titleId, setTitleId }}>
      {children}
    </DialogContext.Provider>
  );
}

function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showClose?: boolean;
  /** When "footer", focus the first focusable control in DialogFooter (e.g. Cancel). */
  initialFocus?: 'default' | 'footer';
}

function resolveInitialFocusTarget(
  root: HTMLElement,
  initialFocus: 'default' | 'footer',
): HTMLElement | null {
  if (initialFocus === 'footer') {
    const footer = root.querySelector<HTMLElement>('[data-dialog-footer]');
    if (footer) {
      const footerFocusables = getFocusableElements(footer);
      if (footerFocusables.length > 0) {
        return footerFocusables[0];
      }
    }
  }

  const focusables = getFocusableElements(root);
  if (focusables.length === 0) return null;

  const firstNonClose = focusables.find(
    (element) => element.getAttribute('aria-label') !== 'Close dialog',
  );
  return firstNonClose ?? focusables[0];
}

export function DialogContent({
  children,
  className,
  showClose = true,
  initialFocus = 'default',
  ...props
}: DialogContentProps) {
  const { open, onOpenChange, titleId } = useDialogContext();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
        return;
      }

      if (event.key !== 'Tab' || !contentRef.current) return;

      const focusables = getFocusableElements(contentRef.current);
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !contentRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTarget = contentRef.current
      ? resolveInitialFocusTarget(contentRef.current, initialFocus)
      : null;
    (focusTarget ?? contentRef.current)?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onOpenChange, initialFocus]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60"
        aria-hidden
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId || undefined}
        tabIndex={-1}
        className={cn(
          'relative z-50 w-full max-w-lg rounded-figma-10 border border-figma-border bg-card p-6 shadow-lg outline-none',
          className,
        )}
        {...props}
      >
        {showClose ? (
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 space-y-2 pr-8', className)} {...props} />;
}

export function DialogTitle({ className, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const generatedId = React.useId();
  const titleId = id ?? generatedId;
  const { setTitleId } = useDialogContext();

  React.useEffect(() => {
    setTitleId(titleId);
    return () => setTitleId('');
  }, [titleId, setTitleId]);

  return <h2 id={titleId} className={cn('text-body-25 text-foreground', className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('font-lato text-body-sm text-figma-accent', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-dialog-footer=""
      className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}
