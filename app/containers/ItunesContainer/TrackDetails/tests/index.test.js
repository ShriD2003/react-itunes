/**
 *
 * Tests for TrackDetails container
 *
 *
 */

import React from 'react';
// import { fireEvent } from '@testing-library/dom';
import { renderProvider } from '@utils/testUtils';
import { TrackDetailsTest as TrackDetails } from '../index';

describe('TrackDetails SubContainer tests', () => {
  let submitSpy;

  beforeEach(() => {
    submitSpy = jest.fn();
    submitSpyClearTrackDetails = jest.fn();
  });

  it('should render and match the snapshot', () => {
    const { baseElement } = renderProvider(
      <TrackDetails dispatchClearTrackDetails={submitSpyClearTrackDetails} dispatchTrackSearch={submitSpy} />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
