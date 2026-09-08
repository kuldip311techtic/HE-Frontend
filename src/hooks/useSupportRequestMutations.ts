import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { closeSupportRequest, respondToSupportRequest } from '@/lib/api/support-requests';
import { getSupportMutationErrorMessage } from '@/lib/utils/errors';
import type { SupportRequestRespondRequest } from '@/types/support-requests';

export function useSupportRequestMutations() {
  const queryClient = useQueryClient();

  const invalidateList = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['super-admin', 'support-requests'],
    });
  };

  const respond = useMutation({
    mutationFn: (payload: SupportRequestRespondRequest) => respondToSupportRequest(payload),
    onSuccess: async (response) => {
      await invalidateList();
      toast.success(response.message || 'Response submitted successfully.');
    },
    onError: (error) => {
      toast.error(getSupportMutationErrorMessage(error, 'respond'));
    },
  });

  const close = useMutation({
    mutationFn: (requestId: string) => closeSupportRequest(requestId),
    onSuccess: async (response) => {
      await invalidateList();
      toast.success(response.message || 'Support request closed successfully.');
    },
    onError: (error) => {
      toast.error(getSupportMutationErrorMessage(error, 'close'));
    },
  });

  return { respond, close };
}
