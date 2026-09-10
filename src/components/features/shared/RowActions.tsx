import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface RowActionItem {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

interface RowActionsProps {
  items: RowActionItem[];
  label?: string;
}

export function RowActions({ items, label = 'Open row actions' }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="min-h-11 min-w-11"
          aria-label={label}
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            disabled={item.disabled}
            aria-disabled={item.disabled || undefined}
            title={item.disabled ? item.disabledReason : undefined}
            className={item.destructive ? 'text-destructive focus:text-destructive' : undefined}
            onSelect={() => {
              if (!item.disabled) item.onSelect();
            }}
          >
            {item.disabled && item.disabledReason ? `${item.label} — ${item.disabledReason}` : item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
