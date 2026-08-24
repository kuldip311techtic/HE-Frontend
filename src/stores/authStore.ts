import {
  clearAuth,
  getStoredEmail,
  getStoredRole,
  getStoredToken,
  hasAdminAccess,
  isAuthenticated,
} from '../lib/auth/session';

export const authStore = {
  getToken: getStoredToken,
  getEmail: getStoredEmail,
  getRole: getStoredRole,
  isAuthenticated,
  hasAdminAccess,
  clear: clearAuth,
};
