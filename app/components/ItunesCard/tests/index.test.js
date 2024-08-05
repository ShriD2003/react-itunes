/**
 *
 * Tests for ItunesCard
 *
 */

import React from 'react';
// import { fireEvent } from '@testing-library/dom'
import { renderProvider } from '@utils/testUtils';
import ItunesCard from '../index';

describe('<ItunesCard/> tests', () => {
  let song;
  beforeEach(() => {
    song = {
      trackName: 'Track',
      trackId: 1234,
      shortDescription: 'Song Description',
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
});
