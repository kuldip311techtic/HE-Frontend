import * as React from 'react';
import { cn } from '@/lib/utils/cn';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Table, TableBody } from '@/components/ui/table';

interface AdminDataTableProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  toolbar?: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function AdminDataTable({
  isLoading,
  isError,
  isEmpty,
  errorMessage,
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyAction,
  toolbar,
  header,
  children,
  footer,
  className,
  'aria-label': ariaLabel,
}: AdminDataTableProps) {
  return (
    <div className={cn('w-full space-y-4', className)}>
      {toolbar}
      <div className="w-full overflow-x-auto rounded-figma-10 border border-[#0d1612]">
        <Table aria-label={ariaLabel}>
          {header}
          <TableBody>
            {isLoading ? (
              <tr>
                <td colSpan={100} className="p-8">
                  <LoadingState label="Loading…" />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={100} className="p-8">
                  <div className="flex flex-col items-center gap-3">
                    <ErrorMessage
                      message={errorMessage ?? 'Something went wrong. Please try again.'}
                    />
                    {onRetry ? (
                      <Button type="button" variant="outline" onClick={onRetry}>
                        Retry
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ) : isEmpty ? (
              <tr>
                <td colSpan={100}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </td>
              </tr>
            ) : (
              children
            )}
          </TableBody>
        </Table>
      </div>
      {footer}
    </div>
  );
}
