/** @jsx jsx */

// TODO REMOVE THIS WITH RADIO PACKAGE, THIS IS JUST PLACEHOLDER

import { jsx, css } from '@emotion/core';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';

interface Props {
  onValueSelect: (value: number) => void;
  value: number | undefined;
}

const tooltipMessage = [
  'Strongly disagree',
  'Disagree',
  'Slightly disagree',
  'Neutral',
  'Slightly agree',
  'Agree',
  'Strongly agree',
];

export default ({ onValueSelect, value }: Props) => (
  <div>
    <div
      css={css`
        display: flex;
        justify-content: space-between;

        & > * {
          flex: 1;
          margin-left: 8px;

          &:first-of-type {
            margin-left: 0;
          }

          & > button {
            width: 100%;
            justify-content: center;
          }
        }
      `}
    >
      {Array.from({ length: 7 }, (_, i) => (
        <Tooltip content={tooltipMessage[i]} key={i} hideTooltipOnClick>
          <Button onClick={() => onValueSelect(i)} isSelected={value === i}>
            {i}
          </Button>
        </Tooltip>
      ))}
    </div>
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        color: grey;
        margin-top: 8px;
        margin-bottom: 24px;

        & > * {
          max-width: 80px;
        }
      `}
    >
      <span>Strongly disagree</span>
      <span
        css={css`
          text-align: center;
        `}
      >
        Neutral
      </span>
      <span
        css={css`
          text-align: right;
        `}
      >
        Strongly agree
      </span>
    </div>
  </div>
);
