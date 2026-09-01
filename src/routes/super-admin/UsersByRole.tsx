import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiClientError } from "@/services/api-client";
import { getAuthToken } from "@/services/api-client";
import { getUsersList } from "@/services/users";
import type { SuperAdminUser } from "@/types/super-admin";

const PAGE_SIZE = 10;

interface UsersByRolePageProps {
  role: "coach" | "player";
  title: string;
  description: string;
}

function UsersByRolePage({ role, title, description }: UsersByRolePageProps) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<SuperAdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await getUsersList();
      setUsers(
        items.filter((user) => user.role.toLowerCase() === role)
      );
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : `Failed to load ${role}s.`
      );
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/super-admin/login", { replace: true });
      return;
    }
    void loadUsers();
  }, [navigate, loadUsers]);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  }, [users, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const emptyLabel = role === "coach" ? "coaches" : "players";

  return (
    <SuperAdminLayout>
      <PageHeader title={title} description={description} />

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-primary"
            onClick={() => void loadUsers()}
          >
            Retry
          </Button>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton count={5} className="sm:grid-cols-1 lg:grid-cols-1" />
      ) : !error && users.length === 0 ? (
        <EmptyState
          title={`No ${emptyLabel}`}
          description={`No ${emptyLabel} have been registered on the platform yet.`}
        />
      ) : (
        <>
          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={user.is_active ? "active" : "inactive"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}
    </SuperAdminLayout>
  );
}

export function CoachesPage() {
  return (
    <UsersByRolePage
      role="coach"
      title="Coaches"
      description="View and manage coach accounts"
    />
  );
}

export function PlayersPage() {
  return (
    <UsersByRolePage
      role="player"
      title="Players"
      description="View and manage player accounts"
    />
  );
}

export default CoachesPage;
