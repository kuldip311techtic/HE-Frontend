import { useEffect } from 'react';
import { runValidationContractProbes } from '@/lib/validation/contract-probe';
import { isLunaValidationMode } from '@/lib/validation/config';

/** Dev bootstrap so Luna validation records contract GETs on protected admin routes. */
export function LunaValidationBootstrap() {
  useEffect(() => {
    if (isLunaValidationMode()) {
      runValidationContractProbes();
    }
  }, []);

  return null;
}
