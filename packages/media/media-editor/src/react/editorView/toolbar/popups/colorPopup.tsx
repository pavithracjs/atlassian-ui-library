import * as React from 'react';
import { Component } from 'react';
import InlineDialog from '@atlaskit/inline-dialog';
import { colors } from '@atlaskit/theme';

import { ColorButton } from './colorButton';
import { ColorPopupContentWrapper } from './popupStyles';

interface ColorCombinations {
  [backgroundColor: string]: string;
}
export const PICKER_COLORS: ColorCombinations = {
  [colors.R300]: colors.R200,
  [colors.Y300]: colors.Y200,
  [colors.G300]: colors.G200,
  [colors.B300]: colors.B200,
  [colors.R100]: colors.R75,
  [colors.Y75]: colors.Y50,
  [colors.G100]: colors.G200,
  [colors.B100]: colors.B100,
  [colors.P100]: colors.P75,
  [colors.T300]: colors.T100,
  [colors.N60]: colors.N40,
  [colors.N800]: colors.N200,
};
export const DEFAULT_COLOR = colors.R300;

export interface ColorPopupProps {
  readonly isOpen: boolean;
  readonly color: string;
  readonly onPickColor: (color: string) => void;
}

export class ColorPopup extends Component<ColorPopupProps> {
  render() {
    const { isOpen, children } = this.props;
    const content = (
      <ColorPopupContentWrapper>
        {this.renderButtons()}
      </ColorPopupContentWrapper>
    );
    return (
      <InlineDialog isOpen={isOpen} placement="top-start" content={content}>
        {children}
      </InlineDialog>
    );
  }

  private renderButtons(): JSX.Element[] {
    const { onPickColor, color: currentColor } = this.props;

    return Object.keys(PICKER_COLORS).map((color, index) => (
      <ColorButton
        key={`${index}`}
        border={PICKER_COLORS[color]}
        background={color}
        currentColor={currentColor}
        onClick={onPickColor}
      />
    ));
  }
}
