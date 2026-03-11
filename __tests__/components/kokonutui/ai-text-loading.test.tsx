import { test, expect } from 'bun:test';
import AITextLoading from '@/components/kokonutui/ai-text-loading';

test('AITextLoading component imports correctly', () => {
    expect(typeof AITextLoading).toBe('function');
});