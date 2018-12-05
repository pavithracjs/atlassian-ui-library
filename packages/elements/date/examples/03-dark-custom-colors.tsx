import * as React from 'react';
import { Date, Color } from '../src';
// AtlaskitThemeProvider is deprecated, we can switch later
// @ts-ignore TS type def for theme is wrong.
import { AtlaskitThemeProvider } from '@atlaskit/theme';

const DateInParagraph = ({ color }: { color?: Color }) => (
  <p>
    <Date value={586137600000} color={color} />
  </p>
);

export default () => (
  <AtlaskitThemeProvider mode={'dark'}>
    <DateInParagraph />
    <DateInParagraph color="red" />
    <DateInParagraph color="green" />
    <DateInParagraph color="blue" />
    <DateInParagraph color="purple" />
    <DateInParagraph color="yellow" />
  </AtlaskitThemeProvider>
);
