import { test, expect } from 'bun:test';
import { renderHook } from '@testing-library/react';
import { useAutoScroll } from '@/hooks/useAutoScroll';

test('useAutoScroll hook returns a ref', () => {
	const { result } = renderHook(() => useAutoScroll([]));
	expect(result.current).toBeDefined();
	expect(result.current.current).toBeNull(); // Initial ref value
});