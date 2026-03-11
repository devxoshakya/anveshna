import { test, expect } from 'bun:test';

test('useApi basic test', () => {
	// Basic test to verify test runner works
	expect(typeof fetch).toBe('function');
});