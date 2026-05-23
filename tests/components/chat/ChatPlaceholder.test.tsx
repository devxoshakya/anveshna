import { test, expect } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { ChatPlaceholder } from '@/components/chat/ChatPlaceholder';

test('renders ChatPlaceholder component', () => {
  const { container } = render(<ChatPlaceholder />);
  expect(container).toBeTruthy();
  const headings = screen.getAllByText(/Introducing Pippo AI/i);
  expect(headings.length).toBeGreaterThan(0);
});