import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DashboardQueryParams } from '@/types/dashboard';

interface DashboardFiltersProps {
  filters: DashboardQueryParams;
  onFiltersChange: (filters: DashboardQueryParams) => void;
  onRefresh: () => void;
  onExport: () => void;
  refreshing?: boolean;
  exportDisabled?: boolean;
}

export default function DashboardFilters({
  filters,
  onFiltersChange,
  onRefresh,
  onExport,
  refreshing = false,
  exportDisabled = false,
}: DashboardFiltersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="dashboard-start-date">Start date</Label>
          <Input
            id="dashboard-start-date"
            type="date"
            value={filters.start_date ?? ''}
            onChange={(event) => {
              onFiltersChange({
                ...filters,
                start_date: event.target.value || undefined,
              });
            }}
            aria-label="Filter analytics start date"
            className="w-full sm:w-auto"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dashboard-end-date">End date</Label>
          <Input
            id="dashboard-end-date"
            type="date"
            value={filters.end_date ?? ''}
            min={filters.start_date}
            onChange={(event) => {
              onFiltersChange({
                ...filters,
                end_date: event.target.value || undefined,
              });
            }}
            aria-label="Filter analytics end date"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh dashboard analytics"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          Refresh
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onExport}
          disabled={exportDisabled}
          aria-label="Export analytics data as CSV"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
