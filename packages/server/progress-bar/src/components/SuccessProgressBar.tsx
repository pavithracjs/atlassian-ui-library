import * as React from 'react';
import { colors } from '@atlaskit/theme';
import ProgressBar from './ProgressBar';
import { CustomProgressBarProps } from '../types';

export default class extends React.PureComponent<CustomProgressBarProps> {
  static defaultProps = {
    value: 0,
    indeterminate: false,
  };

  render() {
    return (
      <ProgressBar
        {...this.props}
        theme={(currentTheme, props) => {
          const theme = currentTheme(props);
          if (this.props.value < 1) {
            return theme;
          }
          return {
            ...theme,
            bar: {
              ...theme.bar,
              background: colors.G300,
            },
          };
        }}
      />
    );
  }
}
