import { useQuery } from "@tanstack/react-query";
import { getOrganizationProfile } from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";

export function useOrganizationProfile() {
  return useQuery({
    queryKey: ["organization", "profile"],
    queryFn: getOrganizationProfile,
    select: (data) => data.profile,
  });
}

export { getApiErrorMessage };
