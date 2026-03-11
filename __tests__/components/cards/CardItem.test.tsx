import { test, expect } from 'bun:test';
import { render } from '@testing-library/react';
import { CardItem } from '@/components/cards/CardItem';

test('renders CardItem component', () => {
    const mockAnime = {
        id: 1,
        title: { 
            english: 'Test Title',
            romaji: 'Test Title',
            native: 'テスト'
        },
        image: '/test.jpg',
        description: 'Test Description',
        type: 'TV',
        status: 'FINISHED',
        genres: ['Action']
    };
    const { container } = render(<CardItem anime={mockAnime} />);
    expect(container).toBeTruthy();
});