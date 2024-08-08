/**
 *
 * Tests for ItunesCard
 *
 */

import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { renderProvider, timeout } from '@utils/testUtils';
import ItunesCard from '../index';

describe('<ItunesCard/> tests', () => {
  let song;
  beforeEach(() => {
    song = {
      trackName: 'Track',
      trackId: 1234,
      shortDescription: 'Song Description',
      longDescription: 'Long Description for the song component',
      artworkUrl100:
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fdribbble.com%2Fshots%2F14395014-Music-Logo&psig=AOvVaw3I_T0J8_ZRKW_g4VF_KmKz&ust=1630933127025000&source=images&cd=vfe&ved=2ahUKEwiT5uO-8efyAhWVHLcAHVSbCvQQjRx6BAgAEAk',
      artistName: 'Artist Name',
      previewUrl: 'https://mockurl.com/'
    };
  });

  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(<ItunesCard song={song} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should contain 1 SongCard component', () => {
    const { getAllByTestId } = renderProvider(<ItunesCard song={song} />);
    expect(getAllByTestId('song-card').length).toBe(1);
  });

  it('displays play button and plays the song on click', async () => {
    renderProvider(<ItunesCard song={song} trackDetails={true} />);

    const playButton = screen.getByTestId('play-btn');
    const audioElement = screen.getByTestId('audio-element');

    fireEvent.click(playButton);
    expect(audioElement).toHaveProperty('paused', true);
  });

  it('displays stop button and pauses the song on click', async () => {
    renderProvider(<ItunesCard song={song} trackDetails={true} />);

    const playButton = screen.getByTestId('play-btn');
    const stopButton = screen.getByTestId('stop-btn');
    const audioElement = screen.getByTestId('audio-element');

    fireEvent.click(playButton);
    expect(audioElement).toHaveProperty('paused', true);

    fireEvent.click(stopButton);
    expect(audioElement).toHaveProperty('paused', true);
  });

  it('displays a spinner while the song is loading', async () => {
    renderProvider(<ItunesCard song={song} trackDetails={true} />);

    const playButton = screen.getByTestId('play-btn');
    const audioElement = screen.getByTestId('audio-element');

    Object.defineProperty(audioElement, 'readyState', { value: 0 });

    fireEvent.click(playButton);
    expect(screen.getByTestId('spin')).toBeInTheDocument();
  });

  test('calls onActionClick callback when play button is clicked', () => {
    const onActionClick = jest.fn();
    renderProvider(<ItunesCard song={song} trackDetails={true} onActionClick={onActionClick} />);

    const playButton = screen.getByTestId('play-btn');
    fireEvent.click(playButton);

    expect(onActionClick).toHaveBeenCalled();
  });
});
