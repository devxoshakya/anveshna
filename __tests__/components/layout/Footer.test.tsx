import { test, expect } from 'bun:test';
import { render } from '@testing-library/react';
import { Footer } from '@/components/layout/Footer';

test('renders Footer component', () => {
  const { container } = render(<Footer />);
  expect(container).toBeTruthy();
});