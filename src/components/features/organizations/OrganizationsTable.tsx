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
import { RowActionsMenu } from '@/components/shared/RowActionsMenu';
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
  >(organizations, compareOrganizations);

  if (isLoading) {
    return (
      <div className="admin-manage-table">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={`org-skeleton-${index}`} className="h-12 w-full bg-[#13291b]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-manage-table overflow-x-auto">
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
              <TableCell className="font-medium text-white">{organization.name}</TableCell>
              <TableCell>{organization.contact_email || organization.email}</TableCell>
              <TableCell>{displayPhone(organization)}</TableCell>
              <TableCell className="text-right">
                <RowActionsMenu
                  appearance="admin"
                  ariaLabel={'Actions for ' + organization.name}
                  actions={[
                    {
                      id: 'edit',
                      label: 'Edit',
                      onSelect: () => onEdit(organization),
                    },
                    {
                      id: 'remove',
                      label: 'Remove',
                      onSelect: () => onRemove(organization),
                      destructive: true,
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
