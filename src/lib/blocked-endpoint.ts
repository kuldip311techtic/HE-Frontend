/** JAW-9613: copy for UI actions blocked until backend exposes the contract route. */
export function blockedEndpointNotice(action: string): string {
  return `${action} requires a backend endpoint (not yet available).`;
}

export const SUPPORT_RESPOND_BLOCKED_NOTICE = blockedEndpointNotice(
  "Response submission",
);

export const SUPPORT_CLOSE_BLOCKED_NOTICE = blockedEndpointNotice(
  "Closing requests",
);
