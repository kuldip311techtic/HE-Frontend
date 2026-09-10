import { Check, Columns3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface ColumnOption {
  key: string;
  label: string;
  alwaysVisible?: boolean;
}

interface ColumnVisibilityMenuProps {
  columns: ColumnOption[];
  visibleKeys: string[];
  onToggle: (key: string) => void;
}

export function ColumnVisibilityMenu({ columns, visibleKeys, onToggle }: ColumnVisibilityMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline">
          <Columns3 className="h-4 w-4" aria-hidden="true" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        {columns.map((column) => {
          const visible = visibleKeys.includes(column.key);
          const locked = Boolean(column.alwaysVisible);
          return (
            <DropdownMenuItem
              key={column.key}
              disabled={locked}
              onSelect={(event) => {
                event.preventDefault();
                if (!locked) onToggle(column.key);
              }}
            >
              <Check
                className={cn('mr-2 h-4 w-4', visible ? 'opacity-100' : 'opacity-0')}
                aria-hidden="true"
              />
              {column.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
