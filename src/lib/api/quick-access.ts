import { isAxiosError } from 'axios';
import type { QuickAccessLinkItem } from '@/types/api';
import { apiClient } from './client';
import { CONTRACT_ROUTES, contractPathToClientPath, unwrapListResponse } from './endpoints';

const { method, path: contractPath, listUnwrapKey } = CONTRACT_ROUTES.superAdminQuickAccess;

/** GET /api/super-admin/quick-access — bare array [{ module, link }, ...] */
export async function fetchQuickAccess(): Promise<QuickAccessLinkItem[] | null> {
  try {
    const { data } = await apiClient.request<QuickAccessLinkItem[]>({
      method,
      url: contractPathToClientPath(contractPath),
    });

    const items = unwrapListResponse<QuickAccessLinkItem[]>(data, listUnwrapKey);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}
