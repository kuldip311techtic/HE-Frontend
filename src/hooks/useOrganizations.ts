import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/api/queryKeys';
import {
  createOrganization,
  deleteOrganization,
  listOrganizations,
  updateOrganization,
} from '@/lib/api/services/organizations';
import type {
  OrganizationCreateRequest,
  OrganizationListParams,
  OrganizationUpdateRequest,
} from '@/types/organization';

export function useOrganizations(params: OrganizationListParams) {
  return useQuery({
    queryKey: queryKeys.organizations(params),
    queryFn: () => listOrganizations(params),
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrganizationCreateRequest) => createOrganization(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['super-admin', 'organizations'] });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      payload,
    }: {
      organizationId: string;
      payload: OrganizationUpdateRequest;
    }) => updateOrganization(organizationId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['super-admin', 'organizations'] });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (organizationId: string) => deleteOrganization(organizationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['super-admin', 'organizations'] });
    },
  });
}
