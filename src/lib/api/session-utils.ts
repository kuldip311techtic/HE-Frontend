/** Extract a session id from an optional dashboard link or path segment. */
export function extractSessionId(link: string | null | undefined): string | null {
  if (!link?.trim()) return null;
  const match = link.match(/sessions\/([^/?#]+)/i);
  return match?.[1] ?? null;
}
