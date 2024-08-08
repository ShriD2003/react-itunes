/* eslint-disable complexity */
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

import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { colors } from '@app/themes';

import { Card, Typography, Button, Progress, Spin } from 'antd';

import { Link } from 'react-router-dom';

import { translate } from '@app/utils';
import { PlayCircleTwoTone, PauseCircleTwoTone } from '@ant-design/icons';

const { Paragraph } = Typography;

const CustomCard = styled(Card)`
  && {
    width: 300px;
    height: 450px;
    margin: 1rem 0;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${colors.musicGridBg};
    border: 1px solid #ffdbac;
  }
`;

const CardContent = styled.div`
  flex: 1;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: cover;
  margin-bottom: 1rem;
`;

const StyledLink = styled(Link)`
  display: block;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

/**
 * Card for itunes. This card is used to show trackImage and track details.
 *
 *
 * @return { ReactElement } The card thatll be displayed
 */
function ItunesCard({ song, trackDetails, onActionClick }) {
  const { trackName, artworkUrl100, trackId, previewUrl, artistName } = song;

  const [play, setPlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const songElement = useRef(null);

  useEffect(() => {
    const audio = songElement.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setLoading(false);
      };

      const setAudioTime = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const handleMusic = () => {
    const audio = songElement.current;
    if (play) {
      audio.pause();
    } else {
      if (audio.readyState >= 3) {
        audio.play();
      } else {
        setLoading(true);
        audio.load();
      }
    }
    setPlay(!play);
    onActionClick(songElement);
  };

  const handleEnded = () => {
    setPlay(false);
  };

  const handlePlaybackError = () => {
    console.error('Playback error');
    setPlay(false);
  };

  const truncateText = (text, wordLimit) => {
    const words = text?.split('');
    if (words?.length <= wordLimit) {
      return text;
    }
    return `${words?.slice(0, wordLimit).join('')}...`;
  };
  const truncatedTrackName = truncateText(trackName, 18);
  const truncatedLongDescription = truncateText(song.longDescription, 1);
  const truncatedShortDescription = truncateText(song.shortDescription, 25);

  return (
    <CustomCard data-testid="song-card">
      <CardContent>
        <StyledImage src={artworkUrl100} alt={trackName} />
        <StyledLink to={`/details/${trackId}`}>
          <Typography.Title level={4}>{truncatedTrackName}</Typography.Title>
          <Typography.Text>{artistName}</Typography.Text>
        </StyledLink>
        <Paragraph data-testid="para-test">{!truncatedShortDescription || !truncatedLongDescription || ''}</Paragraph>
      </CardContent>
      <div>
        <ButtonContainer>
          <Button
            data-testid="play-btn"
            onClick={handleMusic}
            disabled={loading}
            type={play ? 'text' : 'ghost'}
            icon={<PlayCircleTwoTone />}
          >
            {translate('play-btn')}
          </Button>
          <Button
            data-testid="stop-btn"
            onClick={handleMusic}
            disabled={!play}
            type={!play ? 'text' : 'ghost'}
            icon={<PauseCircleTwoTone />}
            size="large"
          >
            {translate('stop-btn')}
          </Button>
        </ButtonContainer>
        {loading ? (
          <SpinnerContainer>
            <Spin data-testid="spin" />
          </SpinnerContainer>
        ) : (
          <Progress aria-valuenow="50" role="progressbar" percent={Math.round((currentTime / duration) * 100)} />
        )}
      </div>
      <audio data-testid="audio-element" src={previewUrl} ref={songElement} onError={handlePlaybackError}></audio>
    </CustomCard>
  );
}

ItunesCard.defaultProps = {
  onActionClick: () => {}
};

ItunesCard.propTypes = {
  /** The song data to display in the card */
  song: PropTypes.shape({
    trackId: PropTypes.number,
    artworkUrl100: PropTypes.string,
    trackPrice: PropTypes.number,
    previewUrl: PropTypes.string,
    trackName: PropTypes.string,
    shortDescription: PropTypes.string,
    longDescription: PropTypes.string,
    artistName: PropTypes.string
  }),
  width: PropTypes.number,
  height: PropTypes.number,
  trackDetails: PropTypes.bool,
  onActionClick: PropTypes.func
};

export default ItunesCard;
