/**
 * Test homeContainer sagas
 */

/* eslint-disable redux-saga/yield-effects */
import { takeLatest, call, put } from 'redux-saga/effects';
import { getSongs } from '@app/services/itunesApi';
import { apiResponseGenerator } from '@utils/testUtils';
import itunesContainerSaga, { requestSearchItunes } from '../saga';
import { itunesContainerTypes } from '../reducer';

describe('Itunes saga tests', () => {
  const generator = itunesContainerSaga();
  const searchTerm = 'Jo Tum Mere Ho';
  let requestSongsGenerator = requestSearchItunes({ searchTerm });

  it('should start task to watch for SEARCH_ITUNES action', () => {
    expect(generator.next().value).toEqual(takeLatest(itunesContainerTypes.SEARCH_ITUNES, requestSearchItunes));
  });

  it('should ensure that the action FAILURE_SEARCH_ITUNES is dispatched when the api call fails', () => {
    console.log(call(getSongs, searchTerm));
    const res = requestSongsGenerator.next().value;
    expect(res).toEqual(call(getSongs, searchTerm));
    const errorRes = 'something_went_wrong';

    expect(requestSongsGenerator.next(apiResponseGenerator(false, errorRes)).value).toEqual(
      put({
        type: itunesContainerTypes.FAILURE_SEARCH_ITUNES,
        error: errorRes
      })
    );
  });

  it('should ensure that the action SUCCESS_SEARCH_ITUNES is dispatched when the api call succeeds', () => {
    requestSongsGenerator = requestSearchItunes({ searchTerm });
    const res = requestSongsGenerator.next().value;
    expect(res).toEqual(call(getSongs, searchTerm));
    const data = {
      resultCount: 0,
      results: [{ songName: 'Jo Tum Mero Ho', songArtist: 'Anuv Jain' }]
    };
    expect(requestSongsGenerator.next(apiResponseGenerator(true, data)).value).toEqual(
      put({
        type: itunesContainerTypes.SUCCESS_SEARCH_ITUNES,
        data
      })
    );
  });
});
