import { describe, expect, it } from 'vitest';

import {
  formatAttachmentSize,
  formatSupportRequestDate,
  SUPPORT_ACTIONS_PENDING_MESSAGE,
} from '@/lib/api/support-requests';

describe('support request helpers', () => {
  it('formats request dates for display', () => {
    const formatted = formatSupportRequestDate('2026-08-17T08:30:00.000000Z');
    expect(formatted).toContain('2026');
  });

  it('formats attachment sizes', () => {
    expect(formatAttachmentSize(512)).toBe('512 B');
    expect(formatAttachmentSize(245812)).toBe('240.1 KB');
    expect(formatAttachmentSize(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('documents pending respond/close actions', () => {
    expect(SUPPORT_ACTIONS_PENDING_MESSAGE).toContain('JAW-9605');
  });
});
