import { cn } from '@/lib/utils/cn';

interface DataTablePageSortNoteProps {
  className?: string;
}

export function DataTablePageSortNote({
  className = 'admin-manage-table__sort-note',
}: DataTablePageSortNoteProps) {
  return (
    <p className={cn(className)}>
      Sorting applies to the current page only.
    </p>
  );
}
