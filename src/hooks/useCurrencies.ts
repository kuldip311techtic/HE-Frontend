import { useQuery } from '@tanstack/react-query';
import { fetchCurrencies } from '@/lib/api/subscription-plans';
import { queryKeys } from '@/lib/api/query-keys';
import { useAdminAuth } from '@/lib/auth/AdminAuthProvider';

export function useCurrencies() {
  const { canFetchAdminData } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.superAdmin.subscriptionPlanCurrencies,
    queryFn: fetchCurrencies,
    enabled: canFetchAdminData,
    staleTime: 300_000,
  });
}
