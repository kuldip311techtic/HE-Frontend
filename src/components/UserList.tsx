import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { cn, formatRoleLabel } from "@/lib/utils";
import type { SuperAdminUser } from "@/types/super-admin";

interface UserListProps {
  users: SuperAdminUser[];
  isLoading?: boolean;
  onEdit: (user: SuperAdminUser) => void;
  onRemove: (user: SuperAdminUser) => void;
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

function RoleBadge({ role }: { role: string }) {
  const label = formatRoleLabel(role);
  const isCoach = role.toLowerCase() === "coach";

  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-transparent",
        isCoach
          ? "bg-primary/15 text-primary hover:bg-primary/20"
          : "bg-muted text-muted-foreground"
      )}
      aria-label={`Role: ${label}`}
    >
      {label}
    </Badge>
  );
}

export function UserList({
  users,
  isLoading = false,
  onEdit,
  onRemove,
}: UserListProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <Table aria-label="Users">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead scope="col">Name</TableHead>
            <TableHead scope="col">Email</TableHead>
            <TableHead scope="col">Role</TableHead>
            <TableHead scope="col" className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="h-12">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <RoleBadge role={user.role} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                      aria-label={`Edit ${user.name}`}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only sm:not-sr-only sm:inline">
                        Edit
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                      onClick={() => onRemove(user)}
                      disabled={user.is_self}
                      aria-label={
                        user.is_self
                          ? `Cannot remove your own account`
                          : `Remove ${user.name}`
                      }
                      title={
                        user.is_self
                          ? "You cannot remove your own account"
                          : undefined
                      }
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
