import * as React from 'react';
import { Component } from 'react';
import { FrontArea, MainArea } from './lineWidthButtonStyles';
import { THICKNESS_MAX, THICKNESS_MIN } from '../popups/lineWidthPopup';

export interface LineWidthButtonProps {
  readonly isActive: boolean;
  readonly lineWidth: number;
  readonly onLineWidthClick: (lineWidth: number) => void;
}

export class LineWidthIcon extends Component<LineWidthButtonProps> {
  render() {
    const { lineWidth, isActive, onLineWidthClick } = this.props;
    const onClick = () => onLineWidthClick(lineWidth);
    const localMin = 4;
    const localMax = 16;
    const localRange = localMax - localMin;
    const incomingRange = THICKNESS_MAX - THICKNESS_MIN;
    let resultingLineWidth = Math.floor(
      (lineWidth - THICKNESS_MIN) * (localRange / incomingRange) + 4,
    );
    if (resultingLineWidth % 2 > 0) {
      resultingLineWidth -= 1;
    }
    const style = {
      width: `${resultingLineWidth}px`,
      height: `${resultingLineWidth}px`,
      borderRadius: `${resultingLineWidth * 2}px`,
    };

    const mainAreaStyle = {
      padding: `${(18 - resultingLineWidth) / 2}px`,
    };

    return (
      <MainArea onClick={onClick} isActive={isActive} style={mainAreaStyle}>
        <FrontArea style={style} isActive={isActive} />
      </MainArea>
    );
  }
}
