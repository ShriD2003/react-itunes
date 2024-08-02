/**
 *
 * Tests for ItunesCard
 *
 */

import React from 'react';
// import { fireEvent } from '@testing-library/dom'
import { renderWithIntl } from '@utils/testUtils';
import ItunesCard from '../index';

describe('<ItunesCard />', () => {
  it('should render and match the snapshot', () => {
    const { baseElement } = renderWithIntl(<ItunesCard />);
    expect(baseElement).toMatchSnapshot();
  });

  it('should contain 1 ItunesCard component', () => {
    const { getAllByTestId } = renderWithIntl(<ItunesCard />);
    expect(getAllByTestId('itunes-card').length).toBe(1);
  });
});
