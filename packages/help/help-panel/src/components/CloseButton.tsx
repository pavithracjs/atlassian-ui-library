import * as React from 'react';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { CloseButton as StyledCloseButton } from './styled';
import { withHelp, HelpContextInterface } from './HelpContext';

export interface Props {
  help: HelpContextInterface;
}

/**
 * This function will return a CloseButton component only if the function
 * to be executed on the onClick event is passed as a parameter
 *
 * @param onBtnCloseClick - Function executed when the close btn is clicked
 */

const CloseButton = (props: Props) => {
  const {
    help: { onBtnCloseClick },
  } = props;
  return onBtnCloseClick ? (
    <StyledCloseButton onClick={onBtnCloseClick}>
      <CrossCircleIcon label="" size="large" />
    </StyledCloseButton>
  ) : null;
};

export default withHelp(CloseButton);
