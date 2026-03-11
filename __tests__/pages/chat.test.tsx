import { test, expect } from 'bun:test';
import { render } from '@testing-library/react';
import ChatPage from '@/app/(shared)/chat/page';

test('chat page renders correctly', () => {
	const { container } = render(<ChatPage />);
	expect(container).toBeTruthy();
});