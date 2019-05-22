import * as React from 'react';
import { mount } from 'enzyme';
import { Reset, ResetTheme } from '../../Reset';
import { ThemeProp } from 'src/utils/createTheme';

test('reset', () => {
  expect(mount(<Reset />)).toMatchSnapshot();
});

test('themed reset', () => {
  expect(
    mount(
      <ResetTheme.Provider
        value={(t: ThemeProp) => ({
          ...t,
          backgroundColor: '#000',
          textColor: '#fff',
          linkColor: 'blue',
        })}
      >
        <Reset />
      </ResetTheme.Provider>,
    ),
  ).toMatchSnapshot();
});
