/**
 *
 * Tests for TrackDetails container
 *
 *
 */

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderProvider } from '@utils/testUtils';
import { TrackDetailsTest as TrackDetails } from '../index';

const trackDetailsMock = {
  trackId: 1650765257,
  trackName: 'Dhairya',
  artistName: 'Sajjan Raj Vaidya',
  artworkUrl100:
    'https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/20/94/6e/20946e94-207c-6448-0bbd-05f67548f178/108385.jpg/100x100bb.jpg',
  releaseDate: '2022-10-20T12:00:00Z',
  collectionPrice: 1.29,
  currency: 'USD',
  trackViewUrl: 'https://music.apple.com/us/album/dhairya/1650765256?i=1650765257&uo=4',
  previewUrl:
    'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/43/83/68/438368bf-071d-be09-49c8-88db2e579c52/mzaf_10793998156285356689.plus.aac.p.m4a',
  collectionName: 'Dhairya - Single',
  primaryGenreName: 'Singer/Songwriter',
  country: 'USA'
};

describe('TrackDetails SubContainer tests', () => {
  const dispatchTrackSearch = jest.fn();
  const dispatchClearTrackDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    renderProvider(
      <TrackDetails
        dispatchTrackSearch={dispatchTrackSearch}
        dispatchClearTrackDetails={dispatchClearTrackDetails}
        trackDetails={{}}
        trackSearchError={null}
        width={300}
        height={300}
        padding={10}
        containerWidth={400}
        {...props}
      />
    );

  it('should show error message when trackSearchError is present', () => {
    renderComponent({ trackSearchError: 'Some error occurred' });
    expect(screen.getByTestId('track-detail-error')).toBeInTheDocument();
  });

  it('should display track details when trackDetails is provided', () => {
    const trackDetails = {
      trackName: 'Test Track',
      artistName: 'Test Artist',
      releaseDate: '2021-01-01',
      collectionPrice: 9.99,
      currency: 'USD',
      trackViewUrl: 'http://example.com/track',
      previewUrl: 'http://example.com/preview',
      collectionName: 'Test Collection',
      primaryGenreName: 'Pop',
      country: 'USA'
    };

    renderComponent({ trackDetails });
    expect(screen.getByText('Collection: Test Collection')).toBeInTheDocument();
    expect(screen.getByText('Genre: Pop')).toBeInTheDocument();
    expect(screen.getByText('Country: USA')).toBeInTheDocument();
  });

  it('should format release date correctly', () => {
    renderComponent({ trackDetails: trackDetailsMock });
    expect(screen.getByText('Release Date: October 20, 2022')).toBeInTheDocument();
  });

  it('should display price with currency', () => {
    renderComponent({ trackDetails: trackDetailsMock });
    expect(screen.getByText('Price: $1.29')).toBeInTheDocument();
  });

  it('should render preview button when previewUrl is available', () => {
    renderComponent({ trackDetails: trackDetailsMock });
    const previewButton = screen.getByText('Preview');
    expect(previewButton).toBeInTheDocument();
    expect(previewButton.closest('a')).toHaveAttribute('href', trackDetailsMock.previewUrl);
  });

  it('should not render preview button when previewUrl is not available', () => {
    const trackDetailsWithoutPreview = { ...trackDetailsMock, previewUrl: null };
    renderComponent({ trackDetails: trackDetailsWithoutPreview });
    expect(screen.queryByText('Preview')).not.toBeInTheDocument();
  });
});
