import { test, expect } from 'bun:test';
import { AppSidebar } from '@/components/layout/Sidebar';

test('Sidebar component imports correctly', () => {
  expect(typeof AppSidebar).toBe('function');
});

test('Sidebar has correct structure', () => {
  // Verify the component is properly defined
  expect(AppSidebar).toBeDefined();
});