/**
 * JAW-9613: Support respond (POST) and close (PUT) mutations are intentionally
 * not implemented — those routes are absent from live OpenAPI.
 *
 * Respond/close UI stays disabled in SupportRequestDetailPanel with
 * blocked-endpoint helper copy until the backend exposes contract routes.
 *
 * Do not add useRespondToSupportRequest or useCloseSupportRequest here.
 */

export {};
