import { useEffect } from 'react';
import { runValidationContractProbes } from '@/lib/validation/contract-probe';

/** Dev bootstrap so Luna validation records contract GETs on every captured route. */
export function LunaValidationBootstrap() {
  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    runValidationContractProbes();
  }, []);

  return null;
}
