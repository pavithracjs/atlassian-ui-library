/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { gridSize, colors } from '@atlaskit/theme';

interface Props {
  onChange: (value: number) => void;
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

export default ({ onChange, value }: Props) => (
  <div>
    <div
      css={css`
        display: flex;
        justify-content: space-between;

        & > * + * {
          margin-left: ${gridSize()}px;
        }

        & > * {
          flex: 1;

          & > button {
            width: 100%;
            justify-content: center;
          }
        }
      `}
    >
      {Array.from({ length: 7 }, (_, i) => {
        const index = i + 1;
        return (
          <Tooltip content={tooltipMessage[i]} key={index} hideTooltipOnClick>
            <Button
              onClick={() => onChange(index)}
              isSelected={value === index}
              aria-describedby="contextualSurveyStatement"
              aria-label={tooltipMessage[i]}
            >
              {i + 1}
            </Button>
          </Tooltip>
        );
      })}
    </div>
    <div
      css={css`
        font-size: 12px;
        font-weight: 600;
        color: ${colors.N200};
        display: flex;
        margin-top: ${gridSize()}px;
        margin-bottom: ${gridSize() * 3}px;

        & > span {
          width: ${gridSize() * 10}px;
        }
      `}
      aria-hidden
    >
      <span>Strongly disagree</span>
      <span
        css={css`
          text-align: center;
          margin: 0 auto;
          padding: 0 ${gridSize() * 6}px;
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
