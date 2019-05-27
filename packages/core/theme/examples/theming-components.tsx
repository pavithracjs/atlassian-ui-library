import * as React from 'react';
import { Component, Fragment, ReactNode } from 'react';
import { createTheme, ThemeProp } from '../src';
import { Theme, ThemeProps, ThemedValue } from '../src/types';

interface LocalThemeProps extends ThemeProps {
  hover: boolean;
}

interface ThemeTokens {
  backgroundColor: string;
  textColor: string;
}

const defaultButtonTheme = (props: LocalThemeProps) => ({
  backgroundColor: props.hover ? '#ddd' : '#eee',
  textColor: '#333',
});

const contextButtonTheme = (theme: ThemedValue, props: LocalThemeProps) => {
  return {
    // @ts-ignore
    ...theme(props),
    backgroundColor: props.hover ? 'rebeccapurple' : 'palevioletred',
    textColor: props.hover ? '#fff' : 'papayawhip',
  };
};

const propButtonTheme = (theme, props) => ({
  ...theme(props),
  backgroundColor: props.hover ? 'palevioletred' : 'rebeccapurple',
});

const Theme = createTheme<ThemeTokens, LocalThemeProps>(defaultButtonTheme);

type Props = {
  children?: ReactNode;
  theme?: ThemeProp<ThemeTokens, LocalThemeProps>;
};

type State = {
  hover: boolean;
};

class Button extends Component<Props, State> {
  state = {
    hover: false,
  };

  onMouseEnter = () => this.setState({ hover: true });

  onMouseLeave = () => this.setState({ hover: false });

  render() {
    return (
      <Theme.Provider value={this.props.theme}>
        <Theme.Consumer hover={this.state.hover}>
          {tokens => {
            const { backgroundColor, textColor: color } = tokens;
            return (
              <button
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                style={{
                  backgroundColor,
                  border: 0,
                  borderRadius: 3,
                  color,
                  cursor: 'pointer',
                  marginBottom: 10,
                  marginRight: 10,
                  padding: 10,
                }}
                type="button"
              >
                {this.props.children}
              </button>
            );
          }}
        </Theme.Consumer>
      </Theme.Provider>
    );
  }
}

export default () => (
  <Fragment>
    <Button>Default</Button>
    <Theme.Provider value={contextButtonTheme}>
      <Button>Context</Button>
      <Button theme={propButtonTheme}>Custom</Button>
    </Theme.Provider>
  </Fragment>
);
