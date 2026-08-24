import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getOrganizationContactEmail,
  getOrganizationName,
  getOrganizationPhone,
} from "@/lib/organization-helpers";
import type { Organization } from "@/types/organization";

interface OrganizationTableProps {
  organizations: Organization[];
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
  isLoading?: boolean;
}

function OrganizationTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-9 w-24" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function OrganizationTable({
  organizations,
  onEdit,
  onDelete,
  isLoading = false,
}: OrganizationTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Organization Name</TableHead>
            <TableHead scope="col">Contact Email</TableHead>
            <TableHead scope="col">Phone Number</TableHead>
            <TableHead scope="col" className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <OrganizationTableSkeleton />
          ) : (
            organizations.map((organization) => {
              const name = getOrganizationName(organization);

              return (
                <TableRow key={organization.id}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell>{getOrganizationContactEmail(organization)}</TableCell>
                  <TableCell>{getOrganizationPhone(organization)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(organization)}
                        aria-label={`Edit ${name}`}
                        className="min-h-11 min-w-11 sm:min-h-9 sm:min-w-0"
                      >
                        <Pencil className="h-4 w-4 sm:mr-1" aria-hidden="true" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(organization)}
                        aria-label={`Remove ${name}`}
                        className="min-h-11 min-w-11 text-destructive hover:text-destructive sm:min-h-9 sm:min-w-0"
                      >
                        <Trash2 className="h-4 w-4 sm:mr-1" aria-hidden="true" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
