import * as React from 'react';
import { Component } from 'react';
import CheckIcon from '@atlaskit/icon/glyph/check';

import { ColorSample, CheckArea } from './colorButtonStyles';

export interface ColorButtonProps {
  readonly border: string;
  readonly background: string;
  readonly currentColor: string;
  readonly onClick: (color: string) => void;
}

export class ColorButton extends Component<ColorButtonProps> {
  render(): JSX.Element {
    const { border, background, onClick: onColorClick } = this.props;
    const onClick = () => onColorClick(background);
    const style = {
      borderColor: border,
      backgroundColor: background,
    };

    return (
      <ColorSample style={style} onClick={onClick}>
        {this.checkMark()}
      </ColorSample>
    );
  }

  private checkMark(): JSX.Element | null {
    const { background, currentColor } = this.props;

    if (background === currentColor) {
      return (
        <CheckArea>
          <CheckIcon label="check" size="medium" />
        </CheckArea>
      );
    }

    return null;
  }
}
