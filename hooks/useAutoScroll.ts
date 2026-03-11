import { useEffect, useRef, RefObject } from 'react';

interface UseAutoScrollOptions {
    /**
     * Whether to enable auto-scrolling
     * @default true
     */
    enabled?: boolean;
    /**
     * Behavior for scrolling
     * @default 'smooth'
     */
    behavior?: ScrollBehavior;
    /**
     * Delay before scrolling (in ms)
     * @default 0
     */
    delay?: number;
}

/**
 * Hook to automatically scroll a container to the bottom when its content changes
 * 
 * @param dependencies - Array of dependencies that trigger auto-scroll
 * @param options - Scroll configuration options
 * @returns A ref to attach to the scrollable container
 * 
 * @example
 * const scrollRef = useAutoScroll([messages]);
 * return <div ref={scrollRef}>...</div>
 */
export function useAutoScroll<T extends HTMLElement>(
    dependencies: any[],
    options: UseAutoScrollOptions = {}
): RefObject<T> {
    const {
        enabled = true,
        behavior = 'smooth',
        delay = 0
    } = options;

    const containerRef = useRef<T>(null);
    const isUserScrollingRef = useRef(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Track if user is manually scrolling
    useEffect(() => {
        const container = containerRef.current;
        if (!container || !enabled) return;

        let scrollTimeout: NodeJS.Timeout;

        const handleScroll = () => {
            // Clear any existing timeout
            clearTimeout(scrollTimeout);

            // Set flag that user is scrolling
            isUserScrollingRef.current = true;

            // Check if user scrolled to bottom (within 50px threshold)
            const isAtBottom =
                Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 50;

            // After 150ms of no scrolling, reset the flag if at bottom
            scrollTimeout = setTimeout(() => {
                if (isAtBottom) {
                    isUserScrollingRef.current = false;
                }
            }, 150);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [enabled]);

    // Auto-scroll when dependencies change
    useEffect(() => {
        if (!enabled || !containerRef.current) return;

        // Clear any pending scroll timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        const scrollToBottom = () => {
            const container = containerRef.current;
            if (!container) return;

            // Always scroll for new messages unless user is actively scrolling up
            const shouldScroll = !isUserScrollingRef.current;

            if (shouldScroll) {
                if (behavior === 'smooth') {
                    container.scrollTo({
                        top: container.scrollHeight,
                        behavior: 'smooth'
                    });
                } else {
                    container.scrollTop = container.scrollHeight;
                }
            }
        };

        if (delay > 0) {
            scrollTimeoutRef.current = setTimeout(scrollToBottom, delay);
        } else {
            scrollToBottom();
        }

        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [...dependencies, enabled, behavior, delay]);

    return containerRef as RefObject<T>;
}
