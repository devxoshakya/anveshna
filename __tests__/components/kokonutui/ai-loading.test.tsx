import { test, expect } from 'bun:test';
import AILoading from '@/components/kokonutui/ai-loading';

test('AILoading component imports correctly', () => {
    expect(typeof AILoading).toBe('function');
});