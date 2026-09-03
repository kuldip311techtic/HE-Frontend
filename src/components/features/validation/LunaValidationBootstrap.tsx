import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { runValidationContractProbes } from '@/lib/validation/contract-probe';

/** Dev bootstrap so Luna validation can record contract GETs on authenticated admin routes. */
export function LunaValidationBootstrap() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    runValidationContractProbes();
  }, [pathname]);

  return null;
}
