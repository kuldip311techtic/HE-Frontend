import { useEffect, useId, useRef, useState } from 'react';
import { Columns3 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ColumnVisibilityOption {
  id: string;
  label: string;
  visible: boolean;
  alwaysVisible?: boolean;
}

interface ColumnVisibilityMenuProps {
  columns: ColumnVisibilityOption[];
  onToggle: (columnId: string, visible: boolean) => void;
}

export function ColumnVisibilityMenu({ columns, onToggle }: ColumnVisibilityMenuProps) {
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

  return (
    <div ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-input px-3 font-outfit text-body-sm text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Toggle column visibility"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Columns3 className="h-4 w-4" aria-hidden="true" />
        Columns
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-50 mt-1 max-h-72 min-w-[14rem] overflow-y-auto rounded-md border border-border bg-card py-2 shadow-lg"
        >
          {columns.map((column) => (
            <label
              key={column.id}
              className={cn(
                'flex cursor-pointer items-center gap-2 px-3 py-1.5 font-outfit text-body-sm hover:bg-accent',
                column.alwaysVisible && 'cursor-not-allowed opacity-60',
              )}
            >
              <input
                type="checkbox"
                checked={column.visible}
                disabled={column.alwaysVisible}
                onChange={(event) => onToggle(column.id, event.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-foreground">{column.label}</span>
            </label>
          ))}
        </div>
      ) : null}
    </div>
  );
}
