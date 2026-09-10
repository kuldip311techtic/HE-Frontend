import { useCallback, useMemo, useState } from 'react';

export interface ColumnVisibilityConfig {
  id: string;
  alwaysVisible?: boolean;
  defaultVisible?: boolean;
}

function buildInitialVisibility(columns: ColumnVisibilityConfig[]): Record<string, boolean> {
  return Object.fromEntries(
    columns.map((column) => [
      column.id,
      column.alwaysVisible === true || column.defaultVisible !== false,
    ]),
  );
}

export function useColumnVisibility(columns: ColumnVisibilityConfig[]) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(() =>
    buildInitialVisibility(columns),
  );

  const toggleColumn = useCallback((columnId: string, visible: boolean) => {
    const column = columns.find((entry) => entry.id === columnId);
    if (column?.alwaysVisible) {
      return;
    }
    setVisibility((current) => ({ ...current, [columnId]: visible }));
  }, [columns]);

  const toggleableColumns = useMemo(
    () => columns.filter((column) => !column.alwaysVisible),
    [columns],
  );

  return {
    visibility,
    toggleColumn,
    toggleableColumns,
  };
}
