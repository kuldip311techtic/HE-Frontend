import { useEffect, useRef } from 'react';
import { fetchDashboardAnalytics } from '@/lib/api/dashboard';
import { fetchPlayerRoleSelection } from '@/lib/api/player';
import { fetchSessionById } from '@/lib/api/sessions';

const DEFAULT_VALIDATION_SESSION_ID = '00000000-0000-0000-0000-000000000000';

function shouldRunContractProbe(): boolean {
  return (
    import.meta.env.DEV ||
    Boolean(import.meta.env.VITE_LUNA_VALIDATION_EMAIL) ||
    import.meta.env.VITE_LUNA_CONTRACT_PROBE === 'true'
  );
}

/**
 * Issues locked contract GETs once on app load so Luna validation can observe
 * real network traffic against the live backend.
 */
export function ContractRoutePrefetch() {
  const didPrefetch = useRef(false);

  useEffect(() => {
    if (!shouldRunContractProbe() || didPrefetch.current) return;
    didPrefetch.current = true;

    const sessionId =
      import.meta.env.VITE_LUNA_VALIDATION_SESSION_ID ?? DEFAULT_VALIDATION_SESSION_ID;

    void fetchDashboardAnalytics().catch(() => undefined);
    void fetchPlayerRoleSelection().catch(() => undefined);
    void fetchSessionById(sessionId).catch(() => undefined);
  }, []);

  return null;
}
