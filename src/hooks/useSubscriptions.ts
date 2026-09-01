import { useCallback, useEffect, useState } from "react";

import { ApiClientError } from "@/services/api-client";
import {
  createSubscription,
  deleteSubscription,
  listSubscriptions,
  updateSubscription,
} from "@/services/subscriptions";
import type {
  CreateSubscriptionRequest,
  SubscriptionPlan,
  UpdateSubscriptionRequest,
} from "@/types/super-admin";

interface UseSubscriptionsResult {
  subscriptions: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (data: CreateSubscriptionRequest) => Promise<SubscriptionPlan>;
  update: (
    id: string,
    data: UpdateSubscriptionRequest
  ) => Promise<SubscriptionPlan>;
  remove: (id: string) => Promise<void>;
  isMutating: boolean;
}

export function useSubscriptions(): UseSubscriptionsResult {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to load subscription plans.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const create = useCallback(
    async (data: CreateSubscriptionRequest) => {
      setIsMutating(true);
      try {
        const created = await createSubscription(data);
        await refetch();
        return created;
      } finally {
        setIsMutating(false);
      }
    },
    [refetch]
  );

  const update = useCallback(
    async (id: string, data: UpdateSubscriptionRequest) => {
      setIsMutating(true);
      try {
        const updated = await updateSubscription(id, data);
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
        await deleteSubscription(id);
        await refetch();
      } finally {
        setIsMutating(false);
      }
    },
    [refetch]
  );

  return {
    subscriptions,
    isLoading,
    error,
    refetch,
    create,
    update,
    remove,
    isMutating,
  };
}
