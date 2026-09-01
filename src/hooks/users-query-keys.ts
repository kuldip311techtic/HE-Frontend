export const USERS_QUERY_KEY = ['super-admin', 'users'] as const

export function usersQueryKey(page = 1, pageSize = 10) {
  return [...USERS_QUERY_KEY, { page, pageSize }] as const
}
