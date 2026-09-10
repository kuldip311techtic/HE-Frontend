import { useCallback, useState } from 'react';
import type { ColumnOption } from '@/components/features/admin/ColumnVisibilityMenu';

export function useColumnVisibility(columns: ColumnOption[], initialKeys: string[]) {
  const [visibleKeys, setVisibleKeys] = useState(initialKeys);

  const toggleColumn = useCallback(
    (key: string) => {
      setVisibleKeys((current) => {
        const column = columns.find((item) => item.key === key);
        if (column?.alwaysVisible) return current;
        return current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
      });
    },
    [columns],
  );

  return { visibleKeys, toggleColumn };
}
