import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from '@/lib/api/organizations';
import type { OrganizationCreateRequest, OrganizationUpdateRequest } from '@/types/api';

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: OrganizationCreateRequest) => createOrganization(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'organizations'] });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      body,
    }: {
      organizationId: string;
      body: OrganizationUpdateRequest;
    }) => updateOrganization(organizationId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'organizations'] });
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (organizationId: string) => deleteOrganization(organizationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['super-admin', 'organizations'] });
    },
  });
}
