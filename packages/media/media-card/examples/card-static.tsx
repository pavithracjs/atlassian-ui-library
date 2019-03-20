import * as React from 'react';

import { CardLoading, CardError } from '../src';
import { StoryList } from '../../media-test-helpers';

const divStyle = {
  width: '100px',
  height: '100px',
};
const dimensions = { height: 50, width: 50 };

const defaultCards = [
  {
    title: 'Small',
    content: (
      <div style={divStyle}>
        <CardLoading iconSize="small" />
      </div>
    ),
  },
  {
    title: 'Medium',
    content: (
      <div style={divStyle}>
        <CardLoading iconSize="medium" />
      </div>
    ),
  },
  {
    title: 'Large',
    content: (
      <div style={divStyle}>
        <CardLoading iconSize="large" />
      </div>
    ),
  },
  {
    title: 'Error',
    content: (
      <div style={divStyle}>
        <CardError />
      </div>
    ),
  },
];

const resizedCards = [
  {
    title: 'Small',
    content: <CardLoading dimensions={dimensions} iconSize="small" />,
  },
  {
    title: 'Medium',
    content: <CardLoading dimensions={dimensions} iconSize="medium" />,
  },
  {
    title: 'Large',
    content: <CardLoading dimensions={dimensions} iconSize="large" />,
  },
  {
    title: 'Error',
    content: <CardError dimensions={dimensions} />,
  },
];

export default () => (
  <div>
    <h3>Default size</h3>
    <StoryList>{defaultCards}</StoryList>
    <h3>50x50 size</h3>
    <StoryList>{resizedCards}</StoryList>
  </div>
);
