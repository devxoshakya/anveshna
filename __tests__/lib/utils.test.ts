import { test, expect } from 'bun:test';
import { cn } from '@/lib/utils';

test('cn utility function combines classnames correctly', () => {
    const result = cn('class1', 'class2');
    expect(result).toBe('class1 class2');
});

test('cn utility handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'visible');
    expect(result).toContain('base');
    expect(result).toContain('visible');
});