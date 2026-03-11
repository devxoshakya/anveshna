import { test, expect } from 'bun:test';
import { render } from '@testing-library/react';
import { EpisodeList } from '@/components/watch/EpisodeList';

test('renders EpisodeList component', () => {
    const mockEpisodes = [
        { id: '1', number: 1, title: 'Episode 1' },
        { id: '2', number: 2, title: 'Episode 2' }
    ];
    const { container } = render(
        <EpisodeList 
            episodes={mockEpisodes} 
            currentEpisode={mockEpisodes[0]}
            onEpisodeSelect={() => {}}
        />
    );
    expect(container).toBeTruthy();
});