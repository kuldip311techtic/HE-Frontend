import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { OrganizationItem } from '@/types/organizations';

interface OrganizationsTableProps {
  organizations: OrganizationItem[];
  isLoading?: boolean;
  onEdit: (organization: OrganizationItem) => void;
  onRemove: (organization: OrganizationItem) => void;
}

function displayPhone(organization: OrganizationItem): string {
  return organization.phone_number ?? organization.phone ?? '—';
}

export function OrganizationsTable({
  organizations,
  isLoading = false,
  onEdit,
  onRemove,
}: OrganizationsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
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
            <TableHead>Organization name</TableHead>
            <TableHead>Contact email</TableHead>
            <TableHead>Phone number</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((organization) => (
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
