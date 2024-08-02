import { call, put, takeLatest } from 'redux-saga/effects';
import { itunesContainerTypes, itunesContainerCreators } from './reducer';
import { getSongs } from '@services/itunesApi';
import { translate } from '@app/utils/index';

const { SEARCH_ITUNES } = itunesContainerTypes;
const { successSearchItunes, failureSearchItunes } = itunesContainerCreators;

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
 * itunesContainerSaga takes the latest ITUNES data from the api
 */
export default function* itunesContainerSaga() {
  yield takeLatest(SEARCH_ITUNES, requestSearchItunes);
}
