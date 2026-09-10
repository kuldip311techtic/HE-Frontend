import { useCallback, useEffect, useState } from 'react';
import {
  closeSupportRequest,
  fetchSupportRequests,
  respondSupportRequest,
} from '@/lib/api/superAdmin';
import { getApiErrorMessage } from '@/lib/api';
import type { SupportRequest } from '@/types/api';

export function useSupportRequests() {
  const [items, setItems] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await fetchSupportRequests();
      setItems(list);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load support requests.'));
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const respond = async (requestId: string, response: string) => {
    await respondSupportRequest({ request_id: requestId, response });
    await refetch();
  };

  const close = async (id: string) => {
    await closeSupportRequest(id);
    await refetch();
  };

  return { items, isLoading, error, refetch, respond, close };
}
