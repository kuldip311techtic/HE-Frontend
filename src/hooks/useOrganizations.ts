import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import {
  createOrganization,
  deleteOrganization,
  fetchOrganizations,
  updateOrganization,
} from '@/lib/api/services/organizations';
import type { OrganizationWriteRequest } from '@/types/organization';

export function useOrganizationsList() {
  return useQuery({
    queryKey: queryKeys.organizations.all,
    queryFn: fetchOrganizations,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrganizationWriteRequest) => createOrganization(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: OrganizationWriteRequest }) =>
      updateOrganization(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOrganization(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.organizations.all });
    },
  });
}
