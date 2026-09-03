/**
 * JAW-9613: Shared copy for UI actions blocked until backend exposes contract routes.
 * Support respond (POST) and close (PUT) are not in live OpenAPI — do not add
 * mutation hooks until those endpoints ship.
 */
export function blockedEndpointNotice(action: string): string {
  return `${action} requires a backend endpoint (not yet available).`;
}

export const SUPPORT_RESPOND_BLOCKED_NOTICE = blockedEndpointNotice(
  "Response submission",
);

export const SUPPORT_CLOSE_BLOCKED_NOTICE = blockedEndpointNotice(
  "Closing requests",
);
