import * as React from 'react';
import { createAndFire, withAnalyticsEvents } from '../analytics';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next';

import { Analytics } from '../model/Analytics';

import CrossIcon from '@atlaskit/icon/glyph/cross';
import { CloseButton as StyledCloseButton } from './styled';
import { withHelp, HelpContextInterface } from './HelpContext';

export interface Props {
  createAnalyticsEvent: CreateUIAnalyticsEventSignature;
}

/**
 * This function will return a CloseButton component only if the function
 * to be executed on the onClick event is passed as a parameter
 *
 * @param onBtnCloseClick - Function executed when the close btn is clicked
 */

const CloseButton = (props: Props & HelpContextInterface & Analytics) => {
  const {
    help: { onBtnCloseClick },
  } = props;

  const handleOnBtnCloseClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onBtnCloseClick) {
      createAndFire({
        action: 'help-panel-close',
      })(props.createAnalyticsEvent);
      onBtnCloseClick(e);
    }
  };

  return onBtnCloseClick ? (
    <StyledCloseButton onClick={handleOnBtnCloseClick}>
      <CrossIcon label="" size="medium" />
    </StyledCloseButton>
  ) : null;
};

export default withAnalyticsEvents()(withHelp(CloseButton));
