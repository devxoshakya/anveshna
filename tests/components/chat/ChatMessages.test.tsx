import { test, expect } from 'bun:test';
import { render } from '@testing-library/react';
import { ChatMessages } from '@/components/chat/ChatMessages';

test('renders ChatMessages component correctly', () => {
    const { container } = render(<ChatMessages messages={[]} />);
    expect(container).toBeTruthy();
});

test('handles props as expected', () => {
    const messages = [
        { 
            id: '1', 
            content: 'Hello', 
            timestamp: new Date(),
            role: 'user' as const
        }
    ];
    const { getByText } = render(<ChatMessages messages={messages} />);
    expect(getByText(/Hello/i)).toBeTruthy();
});