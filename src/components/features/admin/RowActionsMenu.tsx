import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface RowAction {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
  title?: string;
}

interface RowActionsMenuProps {
  actions: RowAction[];
  label?: string;
}

export function RowActionsMenu({ actions, label = 'Row Actions' }: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={label}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.label}
            disabled={action.disabled}
            aria-disabled={action.disabled || undefined}
            title={action.title}
            className={action.destructive ? 'text-destructive focus:text-destructive' : undefined}
            onSelect={(event) => {
              if (action.disabled) {
                event.preventDefault();
                return;
              }
              action.onSelect();
            }}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
