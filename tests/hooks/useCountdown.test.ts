import { test, expect } from 'bun:test';
import { renderHook } from '@testing-library/react';
import { useCountdown } from '@/hooks/useCountdown';

test('useCountdown hook initializes correctly', () => {
    const targetDate = Date.now() + 10000; // 10 seconds from now
    const { result } = renderHook(() => useCountdown(targetDate));
    
    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('string');
});