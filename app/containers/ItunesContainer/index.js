import React, { useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import styled from '@emotion/styled';
import { injectSaga } from 'redux-injectors';
import { Card, IconButton, Skeleton, InputAdornment, OutlinedInput, CardHeader, Divider } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import T from '@components/T';
import { If } from '@components/If';
import { For } from '@components/For';
import { ItunesCard } from '@components/ItunesCard';
import colors from '@app/themes/colors';
import { selectLoading, selectItunesData, selectItunesError, selectSearchTerm } from './selectors';
import { itunesContainerCreators } from './reducer';
import { translate } from '@app/utils';
import itunesContainerSaga from './saga';

const CustomCard = styled(Card)`
  && {
    margin: 1.25rem 0;
    padding: 1rem;
    max-width: ${(props) => props.maxwidth};
    color: ${(props) => props.color};
    ${(props) => props.color && `color: ${props.color}`};
  }
`;
const CustomCardHeader = styled(CardHeader)`
  && {
    padding: 0;
  }
`;
const Container = styled.div`
  && {
    display: flex;
    flex-direction: column;
    max-width: ${(props) => props.maxwidth}px;
    width: 100%;
    margin: 0 auto;
    padding: ${(props) => props.padding}px;
  }
`;
const RightContent = styled.div`
  display: flex;
  align-self: flex-end;
`;

const StyledT = styled(T)`
  && {
    color: ${colors.gotoStories};
  }
`;

const StyledOutlinedInput = styled(OutlinedInput)`
  legend {
    display: none;
  }
  > fieldset {
    top: 0;
  }
`;

export function ItunesContainer({
  dispatchItunesData,
  dispatchClearItunesData,
  itunesData,
  itunesError,
  searchTerm,
  maxwidth,
  padding,
  loading
}) {
  const history = useHistory();
  useEffect(() => {
    if (searchTerm && !itunesData?.items?.length) {
      console.log({itunesData});
      dispatchItunesData(searchTerm);
    }
  }, []);

  const searchItunes = (searchTerm) => {
    dispatchItunesData(searchTerm);
  };

  const handleOnChange = (searchTerm) => {
  console.log('Search term entered:', searchTerm);
  if (!isEmpty(searchTerm)) {
    searchItunes(searchTerm);
  } else {
    dispatchClearItunesData();
  }
};

  const debouncedHandleOnChange = debounce(handleOnChange, 200);

  const handleStoriesClick = () => {
    history.push('/stories');
    window.location.reload();
  };

  return (
    <Container maxwidth={maxwidth} padding={padding}>
      <RightContent>
        <StyledT onClick={handleStoriesClick} data-testid="redirect" id="stories" />
      </RightContent>
      <CustomCard maxwidth={maxwidth}>
        <CustomCardHeader title={translate('music_search')} />
        <Divider sx={{ mb: 1.25 }} light />
        <T marginBottom={10} id="get_music_details" />
        <StyledOutlinedInput
          inputProps={{ 'data-testid': 'search-bar' }}
          onChange={(event) => debouncedHandleOnChange(event.target.value)}
          fullWidth
          defaultValue={searchTerm}
          placeholder={translate('default_template')}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                data-testid="search-icon"
                aria-label="search itunes"
                type="button"
                onClick={() => searchItunes(searchTerm)}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </CustomCard>
      {renderItunesList(itunesData, loading, searchTerm)}
      {/* {renderErrorState(searchTerm, loading, itunesError)} */}
    </Container>
  );
}

const renderSkeleton = () => {
  return (
    <>
      <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
      <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
      <Skeleton data-testid="skeleton" animation="wave" variant="text" height={40} />
    </>
  );
};

const renderItunesList = (itunesData, loading, searchTerm) => {
  const items = get(itunesData, 'items', []);
  console.log(items, "items");
  const totalCount = get(itunesData, 'totalCount', 0);
console.log(itunesData);
  return (
    <If condition={!isEmpty(items) || loading}>
      <CustomCard>
        <If condition={!loading} otherwise={renderSkeleton()}>
          <>
            <If condition={!isEmpty(searchTerm)}>
              <div>
                <T id="search_query" values={{ searchTerm }} />
              </div>
            </If>
            <If condition={totalCount !== 0}>
              <div>
                <T id="matching_music" values={{ totalCount }} />
              </div>
            </If>
            <For
              of={items}
              ParentComponent={Container}
              renderItem={(item, index) => <ItunesCard key={index} {...item} />}
            />
          </>
        </If>
      </CustomCard>
    </If>
  );
};

// const renderErrorState = (searchTerm, loading, itunesError) => {
//   let itunesError;
//   let messageId;
//   if (itunesError) {
//     itunesError = itunesError;
//     messageId = 'error-message';
//   } else if (isEmpty(searchTerm)) {
//     itunesError = 'tunes_search_default';
//     messageId = 'default-message';
//   }

//   return (
//     <If condition={!loading && itunesError}>
//       <CustomCard color={itunesError ? 'red' : 'grey'}>
//         <CustomCardHeader title={translate('music_list')} />
//         <Divider sx={{ mb: 1.25 }} light />
//         <T data-testid={messageId} id={itunesError} text={itunesError} />
//       </CustomCard>
//     </If>
//   );
// };

ItunesContainer.propTypes = {
dispatchItunesData: PropTypes.func,
  dispatchClearItunesData: PropTypes.func,
  intl: PropTypes.object,
  itunesData: PropTypes.shape({
    totalCount: PropTypes.number,
    incompleteResults: PropTypes.bool,
    items: PropTypes.array
  }),
  itunesError: PropTypes.string,
  searchTerm: PropTypes.string,
  history: PropTypes.object,
  maxwidth: PropTypes.number,
  padding: PropTypes.number,
  loading: PropTypes.bool
};

ItunesContainer.defaultProps = {
  maxwidth: 500,
  padding: 20,
  itunesData: {},
  itunesError: null
};

const mapStateToProps = createStructuredSelector({
  loading: selectLoading(),
  itunesData: selectItunesData(),
  itunesError: selectItunesError(),
  searchTerm: selectSearchTerm()
});

// eslint-disable-next-line require-jsdoc
export function mapDispatchToProps(dispatch) {
  const { requestGetItunesData, clearItunesData } = itunesContainerCreators;
  
  return {
    dispatchItunesData: (searchTerm) => dispatch(requestGetItunesData(searchTerm)),
    dispatchClearItunesData: () => dispatch(clearItunesData())
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo, injectSaga({ key: 'itunesContainer', saga: itunesContainerSaga }))(ItunesContainer);

// export const ItunesContainerTest = compose()(ItunesContainer);
