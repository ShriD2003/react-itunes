import React, { useEffect, memo, useState } from 'react';
import { injectSaga } from 'redux-injectors';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { styled } from 'styled-components';
import { Card, Skeleton, Input } from 'antd';
import { colors, media } from '@app/themes';
import T from '@components/T';
import ItunesCard from '@app/components/ItunesCard/index';
import { If } from '@components/If';
import { For } from '@components/For';
import { selectItunesContainer, selectGridData, selectSearchError, selectSearchTerm } from './selectors';
import { itunesContainerCreators } from './reducer';
import itunesContainerSaga from './saga';

const { Search } = Input;

const CustomCard = styled(Card)`
  && {
    margin: 10px 0;
    max-width: ${(props) => props.containerWidth};
    color: ${(props) => props.color};
    ${(props) => props.color && `color: ${props.color}`};
  }
`;

const Container = styled.div`
  && {
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    background-color: ${colors.musicGridBg};
    max-width: ${(props) => props.containerWidth}px;
    padding: ${(props) => props.padding}px;
  }
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: ${(props) => props.maxwidth}px;
  width: 90%;
  margin: 10px auto;
  padding: 5px 50px;
  background-color: ${colors.musicGridBg};
  border-radius: 40px;
`;

const MusicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 0.5em;
  grid-row-gap: 3em;
  place-items: center;

  ${media.lessThan('desktop')`
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 1em;
  grid-row-gap: 2.2em;
`}
  ${media.lessThan('tablet')`
  grid-template-columns: repeat(1, 1fr);
  grid-column-gap: 1em;
  grid-row-gap: 2.2em;
`}
`;

const StyledT = styled(T)`
  && {
    font-size: 24;
    color: ${colors.styledTColor};
  }
`;

/**
 * Itunes container for audio play. It is responsible for populating itunes grid with data that can be played through itunes.
 *
 *
 * @return { Object } Itunes container with audio play functionality ( play songs etc. ) in itunes
 */
export function ItunesContainer({
  dispatchSearchSongs,
  dispatchClearGridData,
  intl,
  gridData = {},
  searchError = null,
  searchTerm,
  maxwidth,
  padding,
  containerWidth
}) {
  const [loading, setLoading] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const loaded = get(gridData, 'results', null) || searchError;
    // If the loading flag is set to false then the loading flag is disabled.
    if (loading && loaded) {
      setLoading(false);
    }
  }, [gridData]);

  useEffect(() => {
    // Dispatches search suggestions to grid data if searchTerm is not empty.
    if (searchTerm && !gridData?.results?.length) {
      dispatchSearchSongs(searchTerm);
      setLoading(true);
    }
  }, []);

  // eslint-disable-next-line no-shadow
  const handleOnChange = (searchTerm) => {
    // Dispatches the search term to the search term and clears the grid data.
    if (!isEmpty(searchTerm)) {
      dispatchSearchSongs(searchTerm);
      setLoading(true);
    } else {
      dispatchClearGridData();
    }
  };

  const debouncedHandleOnChange = debounce(handleOnChange, 200);

  const handleActionClick = (audioRef) => {
    // Set the current track to the current track if the audioRef is not the current track.
    if (currentTrack?.current?.src !== audioRef?.current.src) {
      setCurrentTrack(audioRef);
    }
    const isPaused = audioRef?.current?.paused;
    // Pause the current track if it is paused.
    if (!isEmpty(currentTrack) && !isPaused && currentTrack?.current?.src !== audioRef?.current.src) {
      currentTrack.current.pause();
    }
  };

  const renderGridData = () => {
    const songs = get(gridData, 'results', []);
    const totalCount = get(gridData, 'resultCount', 0);
    return (
      <If condition={!isEmpty(songs) || !loading}>
        <Skeleton data-testid="skeleton-card" loading={loading} active>
          <If condition={totalCount !== 0}>
            <StyledT id="Matching Songs" values={{ totalCount }} />
          </If>
          <For
            data-testid="grid"
            of={songs}
            ParentComponent={MusicGrid}
            renderItem={(song, index) => (
              <ItunesCard data-testid="song-card" song={song} key={index} onActionClick={handleActionClick} />
            )}
          />
        </Skeleton>
      </If>
    );
  };

  const getErrorMessage = () => {
    if (searchError) {
      return searchError;
    } else if (!get(gridData, 'resultsCount', 0)) {
      return 'default-message';
    }
    return null;
  };

  const renderErrorCard = (error) => (
    <CustomCard color={searchError ? 'red' : 'grey'}>
      <If condition={searchError} otherwise={<T data-testid="default-message" id={error} />}>
        <T data-testid="itunes-error-message" text={error} />
      </If>
    </CustomCard>
  );

  const renderDefaultOrErrorState = () => {
    const error = getErrorMessage();
    return <If condition={!loading && error && isEmpty(gridData)}>{renderErrorCard(error)}</If>;
  };

  return (
    <>
      <Container maxwidth={100} padding={padding} containerWidth={containerWidth}>
        {/* <CustomCard title={intl.formatMessage({ id: 'songs_search' })} maxwidth={maxwidth}> */}
        <CustomCard maxwidth={maxwidth}>
          <T id="music_search_default" />
          <Search
            data-testid="search-bar"
            defaultValue={searchTerm}
            type="text"
            onChange={(evt) => debouncedHandleOnChange(evt.target.value)}
          />
        </CustomCard>
      </Container>
      <ResultContainer maxWidth={maxwidth}>
        {renderGridData()}
        {renderDefaultOrErrorState()}
      </ResultContainer>
    </>
  );
}

ItunesContainer.propTypes = {
  dispatchSearchSongs: PropTypes.func,
  dispatchClearGridData: PropTypes.func,
  intl: PropTypes.object,
  gridData: PropTypes.shape({
    resultCount: PropTypes.number,
    results: PropTypes.array
  }),
  searchError: PropTypes.string,
  searchTerm: PropTypes.string,
  maxwidth: PropTypes.number,
  padding: PropTypes.number,
  containerWidth: PropTypes.number
};

ItunesContainer.defaultProps = {
  maxwidth: 500,
  padding: 20
};

const mapStateToProps = createStructuredSelector({
  itunesContainer: selectItunesContainer(),
  gridData: selectGridData(),
  searchError: selectSearchError(),
  searchTerm: selectSearchTerm()
});

/**
 * Maps dispatch to props. It's used to make it easier to add props to component's props
 *
 * @param dispatch - Redux's dispatch function
 *
 * @return { Object } React props with dispatch to be added to component's props as well as component's
 */
export function mapDispatchToProps(dispatch) {
  const { searchItunes, clearGridData } = itunesContainerCreators;
  return {
    dispatchSearchSongs: (searchTerm) => dispatch(searchItunes(searchTerm)),
    dispatchClearGridData: () => dispatch(clearGridData())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  injectSaga({ key: 'itunesContainer', saga: itunesContainerSaga })
)(ItunesContainer);

export const ItunesContainerTest = compose()(ItunesContainer);
