import { useCallback, useEffect, useState } from "react";

import { ApiClientError } from "@/services/api-client";
import {
  createOrganization,
  deleteOrganization,
  getOrganizationsList,
  updateOrganization,
} from "@/services/organizations";
import type {
  CreateOrganizationRequest,
  SuperAdminOrganization,
  UpdateOrganizationRequest,
} from "@/types/super-admin";

interface UseOrganizationsResult {
  organizations: SuperAdminOrganization[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (data: CreateOrganizationRequest) => Promise<SuperAdminOrganization>;
  update: (
    id: string,
    data: UpdateOrganizationRequest
  ) => Promise<SuperAdminOrganization>;
  remove: (id: string) => Promise<void>;
  isMutating: boolean;
}

export function useOrganizations(): UseOrganizationsResult {
  const [organizations, setOrganizations] = useState<SuperAdminOrganization[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrganizationsList();
      setOrganizations(data);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load organizations.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getOrganizationsList();
        if (!cancelled) {
          setOrganizations(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof ApiClientError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Failed to load organizations.";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const create = useCallback(
    async (data: CreateOrganizationRequest) => {
      setIsMutating(true);
      try {
        const created = await createOrganization(data);
        await refetch();
        return created;
      } finally {
        setIsMutating(false);
      }
    },
    [refetch]
  );

  const update = useCallback(
    async (id: string, data: UpdateOrganizationRequest) => {
      setIsMutating(true);
      try {
        const updated = await updateOrganization(id, data);
        await refetch();
        return updated;
      } finally {
        setIsMutating(false);
      }
    },
    [refetch]
  );

  const remove = useCallback(
    async (id: string) => {
      setIsMutating(true);
      try {
        await deleteOrganization(id);
        await refetch();
      } finally {
        setIsMutating(false);
      }
    },
    [refetch]
  );

  return {
    organizations,
    isLoading,
    error,
    refetch,
    create,
    update,
    remove,
    isMutating,
  };
}
