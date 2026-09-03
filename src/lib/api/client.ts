import axios from 'axios';

const DEFAULT_DEV_BASE_URL = '/api';
const DEFAULT_PROD_BASE_URL = 'http://localhost:3300/api';

/** Dev server uses the Vite `/api` proxy; production uses VITE_API_BASE_URL. */
export function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }
  return import.meta.env.DEV ? DEFAULT_DEV_BASE_URL : DEFAULT_PROD_BASE_URL;
}

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});
