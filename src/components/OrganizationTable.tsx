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
import type { SuperAdminOrganization } from "@/types/super-admin";

interface OrganizationTableProps {
  organizations: SuperAdminOrganization[];
  isLoading?: boolean;
  onEdit: (organization: SuperAdminOrganization) => void;
  onRemove: (organization: SuperAdminOrganization) => void;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 4 }).map((__, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function OrganizationTable({
  organizations,
  isLoading = false,
  onEdit,
  onRemove,
}: OrganizationTableProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <Table aria-label="Organizations">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
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
            <TableSkeleton />
          ) : (
            organizations.map((org) => (
              <TableRow key={org.id} className="h-12">
                <TableCell className="font-medium">{org.name || "—"}</TableCell>
                <TableCell>{org.contact_email || "—"}</TableCell>
                <TableCell>{org.phone_number || "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(org)}
                      aria-label={`Edit ${org.name}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only sm:inline">
                        Edit
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onRemove(org)}
                      aria-label={`Remove ${org.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only sm:inline">
                        Remove
                      </span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
