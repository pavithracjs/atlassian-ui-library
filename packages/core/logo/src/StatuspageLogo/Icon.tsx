/* eslint-disable max-len */
import React, { Component } from 'react';
import { uid } from 'react-uid';

import { Props, DefaultProps } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid({ iconGradientStart: iconGradientStop });
  return `<canvas height="32" width="32" aria-hidden="true"></canvas>
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient id="${id}" x1="50%" x2="50%" y1="82.77%" y2="-5.81%">
        <stop stop-color="${iconGradientStop}" offset="0%" />
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="82%" />
      </linearGradient>
    </defs>
    <g fill="none" fill-rule="nonzero">
      <g fill-rule="nonzero" transform="translate(4 7)">
        <circle cx="12" cy="12.923" r="5.538" fill="url(#${id})"/>
        <path fill="currentColor" d="M0.143183246,5.47021699 L3.17443341,9.01649231 C3.40520779,9.27389058 3.80165918,9.30343754 4.06900618,9.08316355 C8.96019542,4.76223186 15.0323494,4.76223186 19.9235386,9.08316355 C20.1908857,9.30343754 20.5873371,9.27389058 20.8181114,9.01649231 L23.8525794,5.47021699 C24.0663737,5.21489204 24.04536,4.84032651 23.8043112,4.60984043 C16.6927794,-1.53661348 7.29976539,-1.53661348 0.201105223,4.60984043 C-0.042871755,4.83774865 -0.0680989446,5.21247486 0.143183246,5.47021699 Z"/>
      </g>
    </g>
  </svg>`;
};

export default class StatuspageIcon extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
