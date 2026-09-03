import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1', undefined, 'text-sm')).toBe('px-2 py-1 text-sm');
  });
});
