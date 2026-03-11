import { test, expect } from 'bun:test';
import { renderHook } from '@testing-library/react';
import { useAiChat } from '@/hooks/useAi';

test('useAi hook initializes correctly', () => {
	const { result } = renderHook(() => useAiChat());
	expect(result.current.messages).toEqual([]);
	expect(result.current.isLoading).toBe(false);
	expect(typeof result.current.sendMessage).toBe('function');
});