import { useEffect, useId, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface RowActionItem {
  id: string;
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface RowActionsMenuProps {
  actions: RowActionItem[];
  ariaLabel: string;
  appearance?: 'default' | 'admin';
}

export function RowActionsMenu({ actions, ariaLabel, appearance = 'default' }: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleSelect = (action: RowActionItem) => {
    if (action.disabled) return;
    setOpen(false);
    action.onSelect();
  };

  const isAdmin = appearance === 'admin';

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        className={cn(
          'inline-flex h-8 w-8 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2',
          isAdmin
            ? 'rounded-figma-10 border border-[#0d1612] text-[#9ca3af] hover:bg-[#13291b] hover:text-white focus-visible:ring-[#86d31f]'
            : 'rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-ring',
        )}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className={cn(
            'absolute right-0 top-full z-50 mt-1 min-w-[10rem] py-1 shadow-lg',
            isAdmin
              ? 'rounded-figma-10 border border-[#0d1612] bg-[#13291b]'
              : 'rounded-md border border-border bg-card',
          )}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              disabled={action.disabled}
              className={cn(
                'flex w-full px-3 py-2 text-left font-outfit text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
                isAdmin
                  ? 'hover:bg-[#0b1f12] focus-visible:ring-[#86d31f]'
                  : 'hover:bg-accent focus-visible:ring-ring',
                action.destructive
                  ? 'text-destructive hover:text-destructive'
                  : isAdmin
                    ? 'text-white'
                    : 'text-foreground',
                action.disabled && 'cursor-not-allowed opacity-50',
              )}
              onClick={() => handleSelect(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
