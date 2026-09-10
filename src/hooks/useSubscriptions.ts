import { useCallback, useEffect, useState } from 'react';
import {
  createSubscription,
  deleteSubscription,
  fetchSubscriptions,
  updateSubscription,
} from '@/lib/api/superAdmin';
import { getApiErrorMessage } from '@/lib/api';
import type { CreateSubscriptionRequest, SubscriptionPlan } from '@/types/api';

export function useSubscriptions() {
  const [items, setItems] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await fetchSubscriptions();
      setItems(list);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load subscription plans.'));
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const create = async (body: CreateSubscriptionRequest) => {
    await createSubscription(body);
    await refetch();
  };

  const update = async (id: string, body: CreateSubscriptionRequest) => {
    await updateSubscription(id, body);
    await refetch();
  };

  const remove = async (id: string) => {
    await deleteSubscription(id);
    await refetch();
  };

  return { items, isLoading, error, refetch, create, update, remove };
}
