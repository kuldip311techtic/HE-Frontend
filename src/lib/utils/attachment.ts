export function getAttachmentLabel(attachment: unknown): string {
  if (!attachment) return 'None';
  if (typeof attachment === 'string') return attachment;
  if (typeof attachment === 'object') {
    const record = attachment as { url?: string; filename?: string; name?: string };
    return record.filename || record.name || record.url || 'Attached file';
  }
  return 'Attached file';
}

export function getAttachmentUrl(attachment: unknown): string | null {
  if (typeof attachment === 'string' && /^https?:\/\//i.test(attachment)) {
    return attachment;
  }
  if (attachment && typeof attachment === 'object') {
    const record = attachment as { url?: unknown; href?: unknown };
    if (typeof record.url === 'string' && /^https?:\/\//i.test(record.url)) {
      return record.url;
    }
    if (typeof record.href === 'string' && /^https?:\/\//i.test(record.href)) {
      return record.href;
    }
  }
  return null;
}
