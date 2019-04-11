/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/core';
import { Theme } from '../theme';
import { ProgressBarProps, ThemeTokens } from '../types';

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

export default class extends React.PureComponent<ProgressBarProps> {
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
