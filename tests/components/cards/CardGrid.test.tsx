import { test, expect } from 'bun:test';
import { render } from '@testing-library/react';
import { CardGrid } from '@/components/cards/CardGrid';

test('renders CardGrid component', () => {
    const mockAnimeList = [
        { 
            id: 1, 
            title: { english: 'Anime 1', romaji: 'Anime 1', native: 'アニメ1' }, 
            image: '/test1.jpg',
            type: 'TV',
            status: 'FINISHED'
        },
        { 
            id: 2, 
            title: { english: 'Anime 2', romaji: 'Anime 2', native: 'アニメ2' }, 
            image: '/test2.jpg',
            type: 'TV',
            status: 'FINISHED'
        }
    ];
    const { container } = render(
        <CardGrid 
            animeData={mockAnimeList} 
            hasNextPage={false} 
            onLoadMore={() => {}}
        />
    );
    expect(container).toBeTruthy();
});