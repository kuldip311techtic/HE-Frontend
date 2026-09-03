import { useEffect } from 'react';
import { runValidationContractProbes } from '@/lib/validation/contract-probe';

/** Dev bootstrap so Luna validation records contract GETs on the first captured route. */
export function LunaValidationBootstrap() {
  useEffect(() => {
    runValidationContractProbes();
  }, []);

  return null;
}
