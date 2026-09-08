import { useCallback, useEffect, useRef, useState } from 'react';
import { Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DataTableColumnDef } from '@/hooks/useColumnVisibility';
import { cn } from '@/lib/utils/cn';

interface DataTableColumnVisibilityProps<TId extends string> {
  columns: DataTableColumnDef<TId>[];
  visibleColumns: Set<TId>;
  onToggleColumn: (columnId: TId) => void;
  menuClassName?: string;
}

function getMenuFocusables(menu: HTMLElement): HTMLElement[] {
  return Array.from(
    menu.querySelectorAll<HTMLElement>(
      'input[type="checkbox"]:not(:disabled), button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function DataTableColumnVisibility<TId extends string>({
  columns,
  visibleColumns,
  onToggleColumn,
  menuClassName,
}: DataTableColumnVisibilityProps<TId>) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const firstCheckbox = menuRef.current?.querySelector<HTMLInputElement>(
      'input[type="checkbox"]:not(:disabled)',
    );
    firstCheckbox?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab' || !menuRef.current) return;

      const focusables = getMenuFocusables(menuRef.current);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeMenu]);

  return (
    <div className="flex justify-end">
      <div className="relative">
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label="Toggle column visibility"
          className="admin-outline-btn"
        >
          <Columns3 className="h-4 w-4" aria-hidden="true" />
          Columns
        </Button>
        {open ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default"
              aria-label="Close column menu"
              onClick={closeMenu}
            />
            <div
              ref={menuRef}
              className={cn(
                'data-table-columns-menu absolute right-0 z-50 mt-2 max-h-72 w-64 overflow-y-auto shadow-lg',
                menuClassName,
              )}
              role="group"
              aria-label="Column visibility"
            >
              {columns.map((col) => (
                <label
                  key={col.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 font-outfit text-body-sm hover:bg-muted/50',
                    col.alwaysVisible && 'cursor-not-allowed opacity-60',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(col.id)}
                    disabled={col.alwaysVisible}
                    onChange={() => onToggleColumn(col.id)}
                    className="h-4 w-4 rounded border-border"
                  />
                  {col.label}
                </label>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
