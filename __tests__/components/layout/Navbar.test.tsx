import { test, expect } from 'bun:test';
import { Navbar } from '@/components/layout/Navbar';

test('Navbar component imports correctly', () => {
	expect(typeof Navbar).toBe('function');
});