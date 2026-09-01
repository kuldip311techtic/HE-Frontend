import { useCallback, useEffect, useState } from "react";

import { ApiClientError } from "@/services/api-client";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "@/services/users";
import type {
  CreateUserRequest,
  PaginationMeta,
  SuperAdminUser,
  UpdateUserRequest,
} from "@/types/super-admin";

export const USERS_PAGE_SIZE = 10;

export interface UserRoleOption {
  value: string;
  label: string;
  description: string;
}

interface UseUsersResult {
  users: SuperAdminUser[];
  pagination: PaginationMeta | null;
  roles: UserRoleOption[];
  isLoading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
  create: (data: CreateUserRequest) => Promise<SuperAdminUser>;
  update: (id: string, data: UpdateUserRequest) => Promise<SuperAdminUser>;
  remove: (id: string) => Promise<void>;
  isMutating: boolean;
}

const DEFAULT_ROLES: UserRoleOption[] = [
  { value: "coach", label: "Coach", description: "Coach account" },
  { value: "player", label: "Player", description: "Player account" },
];

export function useUsers(): UseUsersResult {
  const [users, setUsers] = useState<SuperAdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [roles, setRoles] = useState<UserRoleOption[]>(DEFAULT_ROLES);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (targetPage: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listUsers({
        page: targetPage,
        page_size: USERS_PAGE_SIZE,
      });
      setUsers(response.items);
      setPagination(response.pagination ?? null);
      if (response.roles?.length) {
        setRoles(response.roles);
      }
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load users.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchUsers(page);
  }, [fetchUsers, page]);

  useEffect(() => {
    void fetchUsers(page);
  }, [fetchUsers, page]);

  const create = useCallback(
    async (data: CreateUserRequest) => {
      setIsMutating(true);
      try {
        const created = await createUser(data);
        setPage(1);
        await fetchUsers(1);
        return created;
      } finally {
        setIsMutating(false);
      }
    },
    [fetchUsers]
  );

  const update = useCallback(
    async (id: string, data: UpdateUserRequest) => {
      setIsMutating(true);
      try {
        const updated = await updateUser(id, data);
        await fetchUsers(page);
        return updated;
      } finally {
        setIsMutating(false);
      }
    },
    [fetchUsers, page]
  );

  const remove = useCallback(
    async (id: string) => {
      setIsMutating(true);
      try {
        await deleteUser(id);
        await fetchUsers(page);
      } finally {
        setIsMutating(false);
      }
    },
    [fetchUsers, page]
  );

  return {
    users,
    pagination,
    roles,
    isLoading,
    error,
    page,
    setPage,
    refetch,
    create,
    update,
    remove,
    isMutating,
  };
}
