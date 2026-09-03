import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getOrganizationDisplayName, getOrganizationPhone } from '@/lib/api/organizations';
import type { OrganizationItem } from '@/types/api';

interface OrganizationsTableProps {
  organizations: OrganizationItem[];
  onEdit: (organization: OrganizationItem) => void;
  onRemove: (organization: OrganizationItem) => void;
}

export function OrganizationsTable({
  organizations,
  onEdit,
  onRemove,
}: OrganizationsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization name</TableHead>
            <TableHead>Contact email</TableHead>
            <TableHead>Phone number</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((organization) => (
            <TableRow key={organization.id}>
              <TableCell className="font-medium">
                {getOrganizationDisplayName(organization)}
              </TableCell>
              <TableCell>{organization.contact_email ?? organization.email}</TableCell>
              <TableCell className="tabular-nums">{getOrganizationPhone(organization)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      aria-label={`Actions for ${getOrganizationDisplayName(organization)}`}
                    >
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(organization)}>
                      <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onRemove(organization)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
