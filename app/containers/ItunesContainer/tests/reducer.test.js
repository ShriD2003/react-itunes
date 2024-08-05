import { itunesContainerTypes, initialState } from '../reducer';
import itunesContainerReducer from '../reducer';

/* eslint-disable default-case, no-param-reassign */
describe('ItunesContainer reducer tests', () => {
  let state;
  beforeEach(() => {
    state = initialState;
  });

  it('should return the initial state', () => {
    expect(itunesContainerReducer(undefined, {})).toEqual(state);
  });

  it('should return the initial state when an action of type SEARCH_ITUNES is dispatched', () => {
    const expectedResult = { ...state, searchTerm: 'Anuv Jain' };
    expect(
      itunesContainerReducer(state, {
        type: itunesContainerTypes.SEARCH_ITUNES,
        searchTerm: 'Anuv Jain'
      })
    ).toEqual(expectedResult);
  });

  it('should ensure that when SEARCH_ITUNES is success and SUCESS_SEARCH_ITUNES is dispatched, it clears the searchesError to "null" and then returns data to update gridData  ', () => {
    const data = { songName: 'Jo Tum Mere Ho', songArtist: 'Anuv Jain' };
    const expectedResult = { ...state, searchError: null, gridData: data };
    expect(
      itunesContainerReducer(state, {
        type: itunesContainerTypes.SUCCESS_SEARCH_ITUNES,
        data: data
      })
    ).toEqual(expectedResult);
  });

  it('should ensure that gridData is is erased and searchError is updated, when FETCH_USER_FAILURE is dispatched', () => {
    const error = 'something_went_wrong';
    const expectedResult = { ...state, searchError: error, gridData: {} };
    expect(
      itunesContainerReducer(state, {
        type: itunesContainerTypes.FAILURE_SEARCH_ITUNES,
        error
      })
    ).toEqual(expectedResult);
  });

  it('should return the initial state when CLEAR_GRID_DATA is dispatched', () => {
    expect(
      itunesContainerReducer(state, {
        type: itunesContainerTypes.CLEAR_GRID_DATA
      })
    ).toEqual(initialState);
  });
});
