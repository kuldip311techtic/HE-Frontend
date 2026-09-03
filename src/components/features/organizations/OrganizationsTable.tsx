import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTableSort } from '@/hooks/useTableSort';
import type { OrganizationItem } from '@/types/organizations';

interface OrganizationsTableProps {
  organizations: OrganizationItem[];
  isLoading?: boolean;
  onEdit: (organization: OrganizationItem) => void;
  onRemove: (organization: OrganizationItem) => void;
}

type OrganizationSortKey = 'name' | 'contact_email' | 'phone';

function displayPhone(organization: OrganizationItem): string {
  return organization.phone_number ?? organization.phone ?? '—';
}

function compareOrganizations(
  a: OrganizationItem,
  b: OrganizationItem,
  sortKey: OrganizationSortKey,
): number {
  switch (sortKey) {
    case 'name':
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    case 'contact_email':
      return (a.contact_email || a.email).localeCompare(b.contact_email || b.email, undefined, {
        sensitivity: 'base',
      });
    case 'phone':
      return displayPhone(a).localeCompare(displayPhone(b), undefined, { sensitivity: 'base' });
    default:
      return 0;
  }
}

export function OrganizationsTable({
  organizations,
  isLoading = false,
  onEdit,
  onRemove,
}: OrganizationsTableProps) {
  const { sortKey, sortDirection, sortedRows, handleSort } = useTableSort<
    OrganizationItem,
    OrganizationSortKey
  >(organizations, compareOrganizations, 'name');

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`org-skeleton-${index}`} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              label="Organization name"
              sortKey="name"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              label="Contact email"
              sortKey="contact_email"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <SortableTableHead
              label="Phone number"
              sortKey="phone"
              activeSortKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((organization) => (
            <TableRow key={organization.id}>
              <TableCell className="font-medium">{organization.name}</TableCell>
              <TableCell>{organization.contact_email || organization.email}</TableCell>
              <TableCell>{displayPhone(organization)}</TableCell>
              <TableCell className="text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(organization)}
                    aria-label={`Edit ${organization.name}`}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(organization)}
                    aria-label={`Remove ${organization.name}`}
                  >
                    Remove
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
