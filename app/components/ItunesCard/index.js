/**
 * ItunesCard Component
 *
 * Displays a card for an iTunes song with optional detailed view.
 *
 * @component
 * @example
 * const song = {
 *   trackId: 123,
 *   artworkUrl100: 'https://example.com/artwork.jpg',
 *   trackName: 'Song Title',
 *   trackPrice: 1.99,
 *   previewUrl: 'https://example.com/preview.mp3'
 * };
 * return <ItunesCard song={song} trackDetails={true} />;
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Card } from '@mui/material';
import T from '@components/T';
import media from '@app/themes/media';
import { Link } from 'react-router-dom';

const CustomCard = styled(Card)`
  && {
    margin: 1rem 0;
    padding: 1rem;
  }
`;

const StyledImage = styled.img`
  width: 100px;
  height: ${(props) => (props.trackDetails ? 18 : 14)}em;
  margin-bottom: 2em;
`;

const StyledT = styled(T)`
  && {
    font-size: ${(props) => (props.trackdetails ? 2 : 1.1)}em;
    margin: ${(props) => (props.trackdetails ? '20 0' : 0)}px;
    ${media.lessThan('desktop')`
      font-size: ${(props) => (props.trackdetails ? 1.5 : 1.1)}em;
    `}
    ${media.lessThan('tablet')`
      font-size: ${(props) => (props.trackdetails ? 1.4 : 1.1)}em;
    `}
    ${media.lessThan('mid')`
      font-size: ${(props) => (props.trackdetails ? 1 : 1.1)}em;
    `}
    ${media.lessThan('mobile')`
      font-size: ${(props) => (props.trackdetails ? 0.9 : 1.1)}em;
    `}
  }
`;

const HeaderFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
/**
 * Card for itunes. This card is used to show trackImage and track details.
 *
 *
 * @return { ReactElement } The card thatll be displayed
 */
function ItunesCard({ song, trackDetails }) {
  const { trackName, artworkUrl100, trackId } = song;
  return (
    <CustomCard data-testid="song-card">
      <HeaderFooter>
        <StyledImage src={artworkUrl100} />
        <Link to={`/details/${trackId}`}>
          <StyledT trackdetails={trackDetails?.toString()} text={trackName} />
        </Link>
        ``
      </HeaderFooter>
    </CustomCard>
  );
}

ItunesCard.propTypes = {
  /** The song data to display in the card */
  song: PropTypes.shape({
    trackId: PropTypes.number,
    artworkUrl100: PropTypes.string,
    trackPrice: PropTypes.number,
    previewUrl: PropTypes.string,
    trackName: PropTypes.string
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  trackDetails: PropTypes.bool,
  onActionClick: PropTypes.func
};

export default ItunesCard;
