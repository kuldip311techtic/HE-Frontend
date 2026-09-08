import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { runValidationContractProbes } from '@/lib/validation/contract-probe';
import { isLunaContractProbesEnabled } from '@/lib/validation/config';

/** Optional dev bootstrap: records Super Admin contract GETs per route when probes are enabled. */
export function LunaValidationBootstrap() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isLunaContractProbesEnabled()) {
      return;
    }
    runValidationContractProbes(pathname);
  }, [pathname]);

  return null;
}
