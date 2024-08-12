import { selectItunesContainerDomain, selectSearchError, selectGridData, selectSearchTerm } from '../selectors';
import { initialState } from '../reducer';
describe('Itunes Container selector tests', () => {
  let mockedState;
  let searchTerm;
  let gridData;
  let searchError;

  beforeEach(() => {
    searchTerm = 'Jo Tum Mero Ho';
    gridData = { songName: 'Jo Tum Mere Ho', songArtist: 'Anuv Jain' };
    searchError = 'There was some error while fetching the song details';

    mockedState = {
      itunesContainer: {
        searchTerm,
        gridData,
        searchError
      }
    };
  });
  it('should select the searchTerm', () => {
    const searchTermSelector = selectSearchTerm();
    expect(searchTermSelector(mockedState)).toEqual(searchTerm);
  });

  it('should select gridData', () => {
    const gridDataSelector = selectGridData();
    expect(gridDataSelector(mockedState)).toEqual(gridData);
  });

  it('should select the searchError', () => {
    const searchErrorSelector = selectSearchError();
    expect(searchErrorSelector(mockedState)).toEqual(searchError);
  });

  it('should select the global state', () => {
    const selector = selectItunesContainerDomain(initialState);
    expect(selector).toEqual(initialState);
  });
});
