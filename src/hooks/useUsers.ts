import { useCallback, useEffect, useState } from 'react';
import { createUser, deleteUser, fetchUsers, updateUser } from '@/lib/api/superAdmin';
import { getApiErrorMessage } from '@/lib/api';
import type { CreateUserRequest, User } from '@/types/api';

export function useUsers() {
  const [items, setItems] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchUsers(1);
      setItems(response.items);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load users.'));
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const create = async (body: CreateUserRequest) => {
    await createUser(body);
    await refetch();
  };

  const update = async (id: string, body: CreateUserRequest) => {
    await updateUser(id, body);
    await refetch();
  };

  const remove = async (id: string) => {
    await deleteUser(id);
    await refetch();
  };

  return { items, isLoading, error, refetch, create, update, remove };
}
