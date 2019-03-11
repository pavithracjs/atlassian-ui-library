// @flow
/* eslint-disable max-len */
import React, { Component } from 'react';
import { uid } from 'react-uid';

import { type Props, DefaultProps } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid(iconGradientStart);
  return `<canvas height="32" width="161" aria-hidden="true"></canvas>
  <svg viewBox="0 0 161 32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient x1="50%" y1="-8.10423826%" x2="50%" y2="68.0985109%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M44.168,19.294 C44.168,16.226 42.14,15.056 38.526,14.146 C35.51,13.392 34.418,12.69 34.418,11.286 C34.418,9.726 35.744,8.946 37.98,8.946 C39.748,8.946 41.594,9.258 43.31,10.246 L43.31,7.906 C42.14,7.256 40.554,6.658 38.084,6.658 C34.106,6.658 32.078,8.634 32.078,11.286 C32.078,14.094 33.794,15.42 37.642,16.356 C40.892,17.136 41.828,17.942 41.828,19.45 C41.828,20.958 40.866,21.972 38.292,21.972 C36.03,21.972 33.586,21.374 32,20.542 L32,22.934 C33.326,23.61 34.86,24.26 38.162,24.26 C42.4,24.26 44.168,22.258 44.168,19.294 Z M50.018,19.892 L50.018,13.08 L53.476,13.08 L53.476,11 L50.018,11 L50.018,8.244 L47.834,8.244 L47.834,11 L45.728,11 L45.728,13.08 L47.834,13.08 L47.834,19.944 C47.834,22.362 49.186,24 51.968,24 C52.644,24 53.086,23.896 53.476,23.792 L53.476,21.634 C53.086,21.712 52.592,21.816 52.072,21.816 C50.694,21.816 50.018,21.036 50.018,19.892 Z M65.15,24 L65.15,21.66 C64.318,23.376 62.758,24.26 60.756,24.26 C57.298,24.26 55.556,21.322 55.556,17.5 C55.556,13.834 57.376,10.74 61.016,10.74 C62.914,10.74 64.37,11.598 65.15,13.288 L65.15,11 L67.386,11 L67.386,24 L65.15,24 Z M57.792,17.5 C57.792,20.62 59.04,22.18 61.354,22.18 C63.356,22.18 65.15,20.906 65.15,18.02 L65.15,16.98 C65.15,14.094 63.512,12.82 61.614,12.82 C59.092,12.82 57.792,14.484 57.792,17.5 Z M73.86,19.892 L73.86,13.08 L77.318,13.08 L77.318,11 L73.86,11 L73.86,8.244 L71.676,8.244 L71.676,11 L69.57,11 L69.57,13.08 L71.676,13.08 L71.676,19.944 C71.676,22.362 73.028,24 75.81,24 C76.486,24 76.928,23.896 77.318,23.792 L77.318,21.634 C76.928,21.712 76.434,21.816 75.914,21.816 C74.536,21.816 73.86,21.036 73.86,19.892 Z M79.918,18.618 C79.918,22.206 81.634,24.26 84.624,24.26 C86.366,24.26 87.9,23.402 88.732,21.868 L88.732,24 L90.968,24 L90.968,11 L88.732,11 L88.732,18.228 C88.732,20.854 87.302,22.232 85.222,22.232 C83.09,22.232 82.154,21.192 82.154,18.852 L82.154,11 L79.918,11 L79.918,18.618 Z M103.318,20.464 C103.318,18.202 101.862,17.136 98.976,16.434 C96.584,15.862 95.96,15.29 95.96,14.38 C95.96,13.366 96.844,12.794 98.482,12.794 C99.86,12.794 101.134,13.21 102.694,13.99 L102.694,11.676 C101.732,11.156 100.198,10.74 98.508,10.74 C95.544,10.74 93.802,12.118 93.802,14.38 C93.802,16.512 95.024,17.63 97.91,18.332 C100.38,18.93 101.134,19.502 101.134,20.49 C101.134,21.504 100.25,22.206 98.534,22.206 C96.896,22.206 95.024,21.582 93.906,20.932 L93.906,23.298 C94.894,23.818 96.48,24.26 98.43,24.26 C101.914,24.26 103.318,22.622 103.318,20.464 Z M112.262,24.26 C110.364,24.26 108.908,23.402 108.128,21.712 L108.128,29.07 L105.892,29.07 L105.892,11 L108.128,11 L108.128,13.34 C108.96,11.624 110.52,10.74 112.522,10.74 C115.98,10.74 117.722,13.678 117.722,17.5 C117.722,21.166 115.902,24.26 112.262,24.26 Z M115.486,17.5 C115.486,14.38 114.238,12.82 111.924,12.82 C109.922,12.82 108.128,14.094 108.128,16.98 L108.128,18.02 C108.128,20.906 109.766,22.18 111.664,22.18 C114.186,22.18 115.486,20.516 115.486,17.5 Z M129.136,24 L129.136,21.66 C128.304,23.376 126.744,24.26 124.742,24.26 C121.284,24.26 119.542,21.322 119.542,17.5 C119.542,13.834 121.362,10.74 125.002,10.74 C126.9,10.74 128.356,11.598 129.136,13.288 L129.136,11 L131.372,11 L131.372,24 L129.136,24 Z M121.778,17.5 C121.778,20.62 123.026,22.18 125.34,22.18 C127.342,22.18 129.136,20.906 129.136,18.02 L129.136,16.98 C129.136,14.094 127.498,12.82 125.6,12.82 C123.078,12.82 121.778,14.484 121.778,17.5 Z M143.514,22.96 L143.514,21.66 C142.682,23.376 141.122,24.26 139.12,24.26 C135.688,24.26 133.972,21.322 133.972,17.5 C133.972,13.834 135.766,10.74 139.38,10.74 C141.278,10.74 142.734,11.598 143.514,13.288 L143.514,11 L145.698,11 L145.698,22.83 C145.698,26.652 143.904,29.226 139.25,29.226 C137.066,29.226 135.87,28.94 134.622,28.524 L134.622,26.34 C136.052,26.808 137.534,27.12 139.146,27.12 C142.396,27.12 143.514,25.378 143.514,22.96 Z M136.156,17.5 C136.156,20.62 137.404,22.18 139.718,22.18 C141.72,22.18 143.514,20.906 143.514,18.02 L143.514,16.98 C143.514,14.094 141.876,12.82 139.978,12.82 C137.456,12.82 136.156,14.484 136.156,17.5 Z M159.322,23.48 C158.256,24.052 156.618,24.26 155.292,24.26 C150.43,24.26 148.298,21.452 148.298,17.474 C148.298,13.548 150.482,10.74 154.434,10.74 C158.438,10.74 160.05,13.522 160.05,17.474 L160.05,18.488 L150.56,18.488 C150.872,20.698 152.302,22.128 155.37,22.128 C156.878,22.128 158.152,21.842 159.322,21.426 L159.322,23.48 Z M154.33,12.768 C151.964,12.768 150.768,14.302 150.534,16.564 L157.788,16.564 C157.658,14.146 156.566,12.768 154.33,12.768 Z" fill="inherit" fill-rule="evenodd"></path>
      <ellipse fill="url(#${id})" cx="11.6900001" cy="19.5878182" rx="5.4000001" ry="5.39981818"></ellipse>
      <path d="M0.150296445,13.3410909 L3.11240171,16.7750909 C3.22188902,16.9011063 3.37840885,16.9789144 3.54695495,16.9911129 C3.71550104,17.0033115 3.88201085,16.9488828 4.00924381,16.84 C8.80608592,12.6363636 14.7618754,12.6363636 19.5555596,16.84 C19.6827926,16.9488828 19.8493024,17.0033115 20.0178485,16.9911129 C20.1863946,16.9789144 20.3429144,16.9011063 20.4524017,16.7750909 L23.414507,13.3410909 C23.6383491,13.0812594 23.6059055,12.6932914 23.3418754,12.4725455 C16.3818754,6.51018182 7.18292802,6.51018182 0.222928024,12.4694545 C0.0951564484,12.5755828 0.015714237,12.7270623 0.0020917901,12.8905424 C-0.0115306568,13.0540226 0.0417835359,13.2161 0.150296445,13.3410909 Z" fill="currentColor"></path>
    </g>
  </svg>`;
};

export default class StatuspageLogo extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
