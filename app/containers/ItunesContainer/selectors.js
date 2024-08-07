import { createSelector } from 'reselect';
import get from 'lodash/get';
import { initialState } from './reducer';

/**
 * Direct selector to the itunesContainer state domain
 */

export const selectItunesContainerDomain = (state) => state.itunesContainer || initialState;

/**
 * Returns the state of ITunes. It's used to determine which Iunes container should be selected based on the user's selection state.
 *
 * @param state - The user's selection state. This should be a map of substate names to values.
 *
 * @return { Object } The state of ITunes. It's used to determine which Iunes container should be selected
 */
function getState(state) {
  return createSelector(selectItunesContainerDomain, (substate) => get(substate, state));
}

export const selectItunesContainer = () => createSelector(selectItunesContainerDomain, (substate) => substate);

export const selectGridData = () => getState('gridData');

export const selectSearchTerm = () => getState('searchTerm');

export const selectSearchError = () => getState('searchError');

export const selectTrackDetails = () => getState('trackDetails');

export const selectSongsCache = () => getState('songsCache');

export const selectTrackId = () => getState('trackId');

export const selectTrackSearchError = () => getState('trackSearchError');
