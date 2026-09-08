import { useEffect } from 'react';
import { runValidationContractProbes } from '@/lib/validation/contract-probe';
import { isLunaValidationMode } from '@/lib/validation/config';

/** Dev bootstrap so Luna validation records contract GETs when validation auth is configured. */
export function LunaValidationBootstrap() {
  useEffect(() => {
    if (!isLunaValidationMode()) {
      return;
    }

    void runValidationContractProbes();
  }, []);

  return null;
}
