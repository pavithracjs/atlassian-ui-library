import React from 'react';
import { cleanup, render } from '@testing-library/react';
import SurveyMarshal from '../../SurveyMarshal';

beforeAll(cleanup);
afterEach(cleanup);

it('should not render anything when not open', () => {
  const mock = jest.fn().mockImplementation(() => null);
  render(<SurveyMarshal shouldShow={false}>{mock}</SurveyMarshal>);

  expect(mock).not.toHaveBeenCalled();
});

it('should render the form when open', () => {
  const mock = jest.fn().mockImplementation(() => null);
  render(<SurveyMarshal shouldShow>{mock}</SurveyMarshal>);

  expect(mock).toHaveBeenCalled();
});
