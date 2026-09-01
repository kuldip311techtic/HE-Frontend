import { useQuery } from '@tanstack/react-query'

import { usersQueryKey } from '@/hooks/users-query-keys'
import { listSuperAdminUsers } from '@/services/super-admin'

interface UseUsersOptions {
  page?: number
  pageSize?: number
}

export function useUsers({ page = 1, pageSize = 10 }: UseUsersOptions = {}) {
  return useQuery({
    queryKey: usersQueryKey(page, pageSize),
    queryFn: () => listSuperAdminUsers({ page, page_size: pageSize }),
  })
}
