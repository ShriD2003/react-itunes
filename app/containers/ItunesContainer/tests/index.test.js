/**
 *
 * Tests for ITuneContainer
 *
 */

import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { timeout, renderProvider } from '@utils/testUtils';
import { ItunesContainerTest as ItunesContainer, mapDispatchToProps } from '../index';
import { translate } from '@app/utils';
import { itunesContainerTypes } from '../reducer';

describe('ItunesContainer tests', () => {
  let submitSpy;

  beforeEach(() => {
    submitSpy = jest.fn();
  });

  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(<ItunesContainer dispatchSearchSongs={submitSpy} />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should call dispatchClearGridData on empty change in the search box ', async () => {
    const searchSongsSpy = jest.fn();
    const clearGridDataSpy = jest.fn();
    const { getByTestId } = renderProvider(
      <ItunesContainer dispatchClearGridData={clearGridDataSpy} dispatchSearchSongs={searchSongsSpy} />
    );
    fireEvent.change(getByTestId('search-bar'), {
      target: { value: 'a' }
    });
    await timeout(500);

    expect(searchSongsSpy).toHaveBeenCalled();
    fireEvent.change(getByTestId('search-bar'), {
      target: { value: '' }
    });
    await timeout(500);
    expect(clearGridDataSpy).toHaveBeenCalled();
  });

  it('should call dispatchSearchSongs on change and after enter', async () => {
    const searchTerm = 'Alag Aasmaan ';
    const { getByTestId } = renderProvider(<ItunesContainer dispatchSearchSongs={submitSpy} />);
    const searchBar = getByTestId('search-bar');
    fireEvent.change(searchBar, {
      target: { value: searchTerm }
    });
    await timeout(500);
    expect(submitSpy).toHaveBeenCalledWith(searchTerm);

    fireEvent.keyDown(searchBar, {
      key: 'Enter',
      code: 13,
      charCode: 13
    });
    expect(submitSpy).toHaveBeenCalledWith(searchTerm);
  });

  it('should call dispatchSearchSongs on clicking the search icon', async () => {
    const searchTerm = 'Jo Tum Mere Ho';
    const { getByTestId } = renderProvider(<ItunesContainer dispatchSearchSongs={submitSpy} searchTerm={searchTerm} />);
    fireEvent.click(getByTestId('search-bar'));
    await timeout(500);
    expect(submitSpy).toHaveBeenCalledWith(searchTerm);
  });

  it('should  dispatchSearchSongs on update on mount if searchTerm is already persisted', async () => {
    const searchTerm = 'Choo Lo';
    renderProvider(<ItunesContainer searchTerm={searchTerm} gridData={null} dispatchSearchSongs={submitSpy} />);
    await timeout(500);
    expect(submitSpy).toHaveBeenCalledWith(searchTerm);
  });

  it('should validate mapDispatchToProps actions', async () => {
    const dispatchSearchSpy = jest.fn();
    const searchTerm = 'Jo Tum Mere Ho';
    const actions = {
      dispatchSearchSongs: { searchTerm, type: itunesContainerTypes.SEARCH_ITUNES },
      dispatchClearGridData: { type: itunesContainerTypes.CLEAR_GRID_DATA }
    };

    const props = mapDispatchToProps(dispatchSearchSpy);
    props.dispatchSearchSongs(searchTerm);
    expect(dispatchSearchSpy).toHaveBeenCalledWith(actions.dispatchSearchSongs);

    await timeout(500);
    props.dispatchClearGridData();
    expect(dispatchSearchSpy).toHaveBeenCalledWith(actions.dispatchClearGridData);
  });

  it('should render default error message when search goes wrong', () => {
    const defaultError = translate('something_went_wrong');
    const { getByTestId } = renderProvider(<ItunesContainer searchError={defaultError} />);
    expect(getByTestId('itunes-error-message')).toBeInTheDocument();
    expect(getByTestId('itunes-error-message').textContent).toBe(defaultError);
  });

  it('should render default error message when search goes wrong', async () => {
    const { getByTestId } = renderProvider(<ItunesContainer searchError="error" />);
    await timeout(500);
    expect(getByTestId('itunes-error-message'));
  });
});
