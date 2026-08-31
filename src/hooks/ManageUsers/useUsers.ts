import { useQuery } from "@tanstack/react-query";
import { listUsers } from "@/services/users";

export const USERS_QUERY_KEY = "super-admin-users";

export function useUsers(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, page, pageSize],
    queryFn: () => listUsers(page, pageSize),
  });
}
