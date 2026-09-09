import { useMutation } from '@tanstack/react-query';
import { loginRequest } from '@/lib/api/services/auth';
import type { AuthLoginRequest } from '@/types/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: AuthLoginRequest) => loginRequest(payload),
  });
}
