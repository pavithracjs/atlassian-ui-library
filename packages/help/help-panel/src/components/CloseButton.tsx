import * as React from 'react';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { CloseButton as StyledCloseButton } from './styled';

export interface Props {
  // Search
  onBtnCloseClick?(onBtnCloseClick: React.MouseEvent<HTMLElement>): void;
}

/**
 * This function will return a CloseButton component only if the function
 * to be executed on the onClick event is passed as a parameter
 *
 * @param onBtnCloseClick - Function executed when the close btn is clicked
 */

const CloseButton = (props: Props) => {
  return props.onBtnCloseClick ? (
    <StyledCloseButton onClick={props.onBtnCloseClick}>
      <CrossCircleIcon label="" size="large" />
    </StyledCloseButton>
  ) : null;
};

export default CloseButton;
