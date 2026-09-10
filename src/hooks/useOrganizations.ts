import { useCallback, useEffect, useState } from 'react';
import {
  createOrganization,
  deleteOrganization,
  fetchOrganizations,
  updateOrganization,
} from '@/lib/api/superAdmin';
import { getApiErrorMessage } from '@/lib/api';
import type { CreateOrganizationRequest, Organization } from '@/types/api';

export function useOrganizations() {
  const [items, setItems] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchOrganizations(1);
      setItems(response.items);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load organizations.'));
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const create = async (body: CreateOrganizationRequest) => {
    await createOrganization(body);
    await refetch();
  };

  const update = async (id: string, body: CreateOrganizationRequest) => {
    await updateOrganization(id, body);
    await refetch();
  };

  const remove = async (id: string) => {
    await deleteOrganization(id);
    await refetch();
  };

  return { items, isLoading, error, refetch, create, update, remove };
}
