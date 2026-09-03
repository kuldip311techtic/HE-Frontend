import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from '@/lib/api/organizations';
import type {
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
} from '@/types/organizations';

export function useOrganizationMutations() {
  const queryClient = useQueryClient();

  const invalidateList = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['super-admin', 'organizations'],
    });
  };

  const create = useMutation({
    mutationFn: (payload: OrganizationCreateRequest) => createOrganization(payload),
    onSuccess: async (response) => {
      await invalidateList();
      toast.success(response.message || 'Organization created successfully.');
    },
  });

  const update = useMutation({
    mutationFn: ({
      organizationId,
      payload,
    }: {
      organizationId: string;
      payload: OrganizationUpdateRequest;
    }) => updateOrganization(organizationId, payload),
    onSuccess: async (response) => {
      await invalidateList();
      toast.success(response.message || 'Organization updated successfully.');
    },
  });

  const remove = useMutation({
    mutationFn: (organizationId: string) => deleteOrganization(organizationId),
    onSuccess: async (response) => {
      await invalidateList();
      toast.success(response.message || 'Organization removed successfully.');
    },
  });

  return { create, update, remove };
}
