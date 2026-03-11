import { test, expect } from 'bun:test';
import { Seasons } from '@/components/watch/Seasons';

test('Seasons component imports correctly', () => {
  expect(typeof Seasons).toBe('function');
});