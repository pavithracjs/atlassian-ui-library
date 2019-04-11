/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { ThemeProp } from '@atlaskit/theme';
import { Theme } from '../theme';
import { ThemeProps, ThemeTokens } from '../types';

const maxValue = 1;

const Bar = ({
  indeterminate,
  tokens,
}: {
  indeterminate: boolean;
  tokens: ThemeTokens;
}) => {
  if (indeterminate) {
    return (
      <React.Fragment>
        <span css={[tokens.bar, tokens.increasingBar]} />
        <span css={[tokens.bar, tokens.decreasingBar]} />
      </React.Fragment>
    );
  }
  return <span css={[tokens.bar, tokens.determinateBar]} />;
};

export type Props = {
  /** Current progress, a number between 0 and 1. */
  value: number;
  /** When true the component is in indeterminate state. */
  indeterminate: boolean;
  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
};

export default class extends React.PureComponent<Props> {
  static defaultProps = {
    value: 0,
    indeterminate: false,
  };

  render() {
    const { value, indeterminate, theme } = this.props;
    const valueParsed = indeterminate
      ? 0
      : Math.max(0, Math.min(value, maxValue));

    return (
      <Theme.Provider value={theme}>
        <Theme.Consumer value={value}>
          {tokens => (
            <div
              css={tokens.container}
              role="progressbar"
              aria-valuemin={0}
              aria-valuenow={valueParsed}
              aria-valuemax={maxValue}
              tabIndex={0}
            >
              <Bar indeterminate={indeterminate} tokens={tokens} />
            </div>
          )}
        </Theme.Consumer>
      </Theme.Provider>
    );
  }
}
