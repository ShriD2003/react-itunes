import React, { useEffect, memo } from 'react';
import { injectSaga } from 'redux-injectors';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';
import { styled } from 'styled-components';
import { colors } from '@app/themes';
import T from '@components/T';
import ItunesCard from '@app/components/ItunesCard/index';
import { If } from '@components/If';
import { selectItunesContainer, selectTrackDetails, selectTrackSearchError } from '../selectors';
import { itunesContainerCreators } from '../reducer';
import itunesContainerSaga from '../saga';
import { Typography, Row, Col, Divider, Skeleton } from 'antd';
import {
  CalendarOutlined,
  DollarOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  LeftCircleTwoTone
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Container = styled.div`
  && {
    display: flex;
    margin: 0 auto;
    flex-direction: column;
    background-color: ${colors.black};
    min-width: ${(props) => props.containerWidth}px;
    padding: ${(props) => props.padding}px;
    height: 100vh;
  }
`;

const TrackInfoContainer = styled.div`
  margin-top: 20px;
`;

const TrackDetailsRow = styled(Row)`
  margin-bottom: 20px;
`;

const InfoText = styled(Text)`
  color: ${colors.textColor};
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  margin-top: 20px;
  color: ${colors.linkColor};
`;

/**
 * Track container for audio play. It is responsible for populating itunes grid with data that can be played through itunes.
 *
 *
 * @return { Object } Itunes container with audio play functionality ( play songs etc. ) in itunes
 */
export function TrackDetails({
  dispatchTrackSearch,
  dispatchClearTrackDetails,
  intl,
  trackSearchError = null,
  trackDetails = {},
  width,
  height,
  padding,
  containerWidth
}) {
  const { trackId } = useParams();

  useEffect(() => {
    dispatchClearTrackDetails();
    dispatchTrackSearch(trackId);
  }, [trackId]);

  return (
    <>
      <Container minWidth={'10%'} padding={padding} containerWidth={containerWidth}>
        <If
          condition={isEmpty(trackSearchError)}
          otherwise={<T data-testid="track-detail-error" id="something_went_wrong" />}
        >
          <Skeleton data-testid="track-detail-loading" loading={isEmpty(trackDetails)} active>
            <BackLink to="/itunes">
              <LeftCircleTwoTone />
            </BackLink>

            <TrackInfoContainer>
              <TrackDetailsRow gutter={[16, 16]}>
                <Col span={6}>
                  <If
                    condition={isEmpty(trackSearchError)}
                    otherwise={<T data-testid="track-detail-error" id="something_went_wrong" />}
                  >
                    <Skeleton role="loading-spin" data-testid="skeleton-card" loading={isEmpty(trackDetails)} active>
                      <ItunesCard song={trackDetails} trackDetails width={width} height={height} padding={padding} />
                    </Skeleton>
                  </If>
                </Col>
                <Col span={16}>
                  <Title level={3}>{trackDetails.trackName}</Title>
                  <InfoText strong>{trackDetails.artistName}</InfoText>
                  <Divider />
                  <InfoText>
                    <CalendarOutlined /> Release Date:{' '}
                    {new Date(trackDetails.releaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </InfoText>
                  <br />
                  <InfoText>
                    <DollarOutlined /> Price: {trackDetails.currency === 'USD' ? '$' : ''}
                    {trackDetails.collectionPrice}
                  </InfoText>
                  <br />
                  <InfoText>
                    <LinkOutlined />{' '}
                    <a href={trackDetails.trackViewUrl} target="_blank" rel="noopener noreferrer">
                      View on Apple Music
                    </a>
                  </InfoText>
                  <br />
                  {trackDetails.previewUrl && (
                    <InfoText>
                      <PlayCircleOutlined />{' '}
                      <a href={trackDetails.previewUrl} target="_blank" rel="noopener noreferrer">
                        Preview
                      </a>
                    </InfoText>
                  )}
                  <Title level={4}>Collection: {trackDetails.collectionName}</Title>
                  <InfoText>Genre: {trackDetails.primaryGenreName}</InfoText>
                  <br />
                  <InfoText>Country: {trackDetails.country}</InfoText>
                </Col>
              </TrackDetailsRow>
              <Divider />
            </TrackInfoContainer>
          </Skeleton>
        </If>
      </Container>
    </>
  );
}

TrackDetails.propTypes = {
  dispatchTrackSearch: PropTypes.func,
  dispatchClearTrackDetails: PropTypes.func,
  track: PropTypes.number,
  intl: PropTypes.object,
  trackDetails: PropTypes.object,
  trackSearchError: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  padding: PropTypes.number,
  containerWidth: PropTypes.number
};

const mapStateToProps = createStructuredSelector({
  itunesContainer: selectItunesContainer(),
  trackDetails: selectTrackDetails(),
  trackSearchError: selectTrackSearchError()
});

/**
 * Maps dispatch to props. It's used to make it easier to add props to component's props
 *
 * @param dispatch - Redux's dispatch function
 *
 * @return { Object } React props with dispatch to be added to component's props as well as component's
 */
export function mapDispatchToProps(dispatch) {
  const { searchTrack, clearTrackDetails } = itunesContainerCreators;
  return {
    dispatchTrackSearch: (trackId) => dispatch(searchTrack(trackId)),
    dispatchClearTrackDetails: () => dispatch(clearTrackDetails())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo,
  injectSaga({ key: 'itunesContainer', saga: itunesContainerSaga })
)(TrackDetails);

export { TrackDetails as TrackDetailsTest };
