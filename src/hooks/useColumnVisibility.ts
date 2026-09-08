import { useMemo, useState } from 'react';

export interface DataTableColumnDef<TId extends string = string> {
  id: TId;
  label: string;
  defaultVisible: boolean;
  alwaysVisible?: boolean;
  sortable?: boolean;
}

export function useColumnVisibility<TId extends string>(
  columnDefs: DataTableColumnDef<TId>[],
) {
  const defaultVisible = useMemo(
    () => new Set(columnDefs.filter((col) => col.defaultVisible).map((col) => col.id)),
    [columnDefs],
  );

  const [visibleColumns, setVisibleColumns] = useState<Set<TId>>(() => new Set(defaultVisible));

  const visibleColumnDefs = useMemo(
    () => columnDefs.filter((col) => visibleColumns.has(col.id)),
    [columnDefs, visibleColumns],
  );

  const toggleColumn = (columnId: TId) => {
    const def = columnDefs.find((col) => col.id === columnId);
    if (def?.alwaysVisible) return;

    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(columnId)) {
        next.delete(columnId);
      } else {
        next.add(columnId);
      }
      return next;
    });
  };

  return {
    visibleColumns,
    visibleColumnDefs,
    toggleColumn,
  };
}
