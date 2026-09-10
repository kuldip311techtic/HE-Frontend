import { useCallback, useEffect, useState } from 'react';
import { createUser, deleteUser, fetchUsers, updateUser } from '@/lib/api/superAdmin';
import { getApiErrorMessage } from '@/lib/api';
import type { CreateUserRequest, User } from '@/types/api';

const DEFAULT_PAGE_SIZE = 10;

export function useUsers() {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchUsers(pageNum);
      setItems(response.items);
      setTotal(response.pagination.total);
      setPage(response.pagination.page ?? pageNum);
      if (response.items.length >= DEFAULT_PAGE_SIZE) {
        setPageSize(response.items.length);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load users.'));
      setItems([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPage(page);
  }, [page, loadPage]);

  const refetch = useCallback(async () => {
    await loadPage(page);
  }, [loadPage, page]);

  const create = async (body: CreateUserRequest) => {
    await createUser(body);
    if (page === 1) {
      await loadPage(1);
    } else {
      setPage(1);
    }
  };

  const update = async (id: string, body: CreateUserRequest) => {
    await updateUser(id, body);
    await loadPage(page);
  };

  const remove = async (id: string) => {
    await deleteUser(id);
    const nextPage = items.length === 1 && page > 1 ? page - 1 : page;
    if (nextPage !== page) {
      setPage(nextPage);
    } else {
      await loadPage(page);
    }
  };

  return {
    items,
    isLoading,
    error,
    page,
    setPage,
    total,
    pageSize,
    refetch,
    create,
    update,
    remove,
  };
}
