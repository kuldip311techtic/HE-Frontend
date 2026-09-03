import { useEffect } from 'react';
import { isLunaValidationMode } from '@/lib/validation/config';
import { runValidationContractProbes } from '@/lib/validation/contract-probe';

/** Dev-only bootstrap so Luna validation records contract GETs outside admin page hooks. */
export function LunaValidationBootstrap() {
  useEffect(() => {
    if (!isLunaValidationMode()) {
      return;
    }

    runValidationContractProbes();
  }, []);

  return null;
}
