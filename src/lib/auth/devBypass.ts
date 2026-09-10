/** True when dev bypass is active (explicit env or local Vite dev unless opted out). */
export function isDevAdminBypassEnabled(): boolean {
  return (
    import.meta.env.VITE_DEV_ADMIN_BYPASS === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_DEV_ADMIN_BYPASS !== 'false')
  );
}
