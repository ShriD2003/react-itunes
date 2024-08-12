/* eslint-disable security/detect-object-injection */
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { itunesContainerTypes, itunesContainerCreators } from './reducer';
import { getSongs, getTrackDetails } from '@services/itunesApi';
import { translate } from '@app/utils/index';
import { selectSongsCache } from './selectors';
import { isEmpty } from 'lodash';

const { SEARCH_ITUNES, SEARCH_TRACK } = itunesContainerTypes;
const { successSearchItunes, failureSearchItunes, successSearchTrack, failureSearchTrack } = itunesContainerCreators;

/**
 * Request itunesdata from iTunes. This is a request to the api that looks up the search term.
 *
 * @param action - the action to take on the search term and
 */
export function* requestSearchItunes(action) {
  const res = yield call(getSongs, action.searchTerm);
  const { data, ok } = res;
  // if ok, then put success search itunes
  if (ok) {
    yield put(successSearchItunes(data));
  } else {
    const error = data?.originalError?.message ?? translate('something_went_wrong');
    yield put(failureSearchItunes(error));
  }
}
/**
 * Request information about a track. This is the first step in the search process
 *
 * @param action - the action to take
 */
/**
 * Retrieves the songs cache from the action or the Redux store.
 * @param {Object} action - The action object containing the testSagaCache.
 * @returns {Object} - The songs cache.
 */
function* getSongsCache(action) {
  // Check if the testSagaCache is not empty
  if (!isEmpty(action.testSagaCache)) {
    // Return the testSagaCache if it exists
    return action.testSaga;
  }
  // Otherwise, select the songs cache from the Redux store
  return yield select(selectSongsCache());
}

/**
 * Handles the track if it is found in the cache.
 * @param {Object} songsCache - The cache songs.
 * @param {string} trackId - The ID of the track to search for.
 * @returns {boolean} - True if the track was found in the cache, false otherwise.
 */
function* handleCachedTrack(songsCache, trackId) {
  // Check if the songs cache is not empty and contains the trackId
  if (!isEmpty(songsCache) && songsCache[trackId]) {
    const data = songsCache[trackId];
    const response = { data, trackDetails: data.results[0] };
    // Dispatch a success action with the track details
    yield put(successSearchTrack(response));
    return true;
  }
  return false;
}

/**
 * Fetch the track details from the API.
 * @param {string} trackId - The ID of the track to fetch.
 */
function* fetchTrackDetails(trackId) {
  // Call the API to get track details
  const res = yield call(getTrackDetails, trackId);
  const { data, ok } = res;
  if (ok) {
    const response = { data, trackDetails: data.results[0] };
    // Dispatch a success action with the track details
    yield put(successSearchTrack(response));
  } else {
    // Handle the error case
    const error = data?.originalError?.message ?? translate('something_went_wrong');
    yield put(failureSearchTrack(error));
  }
}

/**
 * Main saga function to request track details.
 * @param {Object} action - The action object containing the trackId and testSagaCache.
 */
export function* requestTrackDetails(action) {
  // Get the songs cache
  const songsCache = yield getSongsCache(action);
  // Check if the track is in the cache
  const isCached = yield handleCachedTrack(songsCache, action.trackId);
  // If the track is not cached, fetch it from the API
  if (!isCached) {
    yield fetchTrackDetails(action.trackId);
  }
}

/**
 * itunesContainerSaga takes the latest ITUNES data from the api
 */
export default function* itunesContainerSaga() {
  yield takeLatest(SEARCH_ITUNES, requestSearchItunes);
  yield takeLatest(SEARCH_TRACK, requestTrackDetails);
}
