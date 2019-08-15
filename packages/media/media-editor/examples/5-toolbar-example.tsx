import * as React from 'react';

import { I18NWrapper } from '@atlaskit/media-test-helpers';
import { colors } from '@atlaskit/theme';
import { ThemeProvider } from 'styled-components';
import Toolbar from '../src/react/editorView/toolbar/toolbar';
import { Theme as ButtonTheme } from '@atlaskit/button';
import { Tool, Blanket } from '../src';

interface State {
  readonly color: string;
  readonly tool: Tool;
  readonly lineWidth: number;
}

class ToolbarExample extends React.Component<{}, State> {
  state: State = {
    color: colors.G300,
    lineWidth: 8,
    tool: 'arrow',
  };

  onSave = () => {
    console.log('Save!');
  };

  onCancel = () => {
    console.log('Cancel!');
  };

  onToolChanged = (tool: Tool) => this.setState({ tool });
  onColorChanged = (color: string) => this.setState({ color });
  onLineWidthChanged = (lineWidth: number) => this.setState({ lineWidth });

  render() {
    const { lineWidth, color, tool } = this.state;

    const theme = { __ATLASKIT_THEME__: { mode: 'dark' } };
    return (
      <I18NWrapper>
        <Blanket>
          <ThemeProvider theme={theme}>
            <ButtonTheme.Provider
              value={(currentTheme, themeProps) =>
                currentTheme({ ...themeProps, mode: 'dark' })
              }
            >
              <Toolbar
                color={color}
                tool={tool}
                lineWidth={lineWidth}
                onSave={this.onSave}
                onCancel={this.onCancel}
                onToolChanged={this.onToolChanged}
                onColorChanged={this.onColorChanged}
                onLineWidthChanged={this.onLineWidthChanged}
              />
            </ButtonTheme.Provider>
          </ThemeProvider>
        </Blanket>
      </I18NWrapper>
    );
  }
}
export default () => <ToolbarExample />;
