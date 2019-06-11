import * as React from 'react';
import { createAndFire, withAnalyticsEvents } from '../analytics';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next';
import Tooltip from '@atlaskit/tooltip';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { messages } from '../messages';
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

const CloseButton = (
  props: Props & HelpContextInterface & Analytics & InjectedIntlProps,
) => {
  const {
    help: { onBtnCloseClick },
    intl: { formatMessage },
  } = props;

  const handleOnBtnCloseClick = (event: React.MouseEvent<any>) => {
    if (onBtnCloseClick) {
      createAndFire({
        action: 'help-panel-close',
      })(props.createAnalyticsEvent);
      onBtnCloseClick(event);
    }
  };

  return onBtnCloseClick ? (
    <Tooltip content={formatMessage(messages.help_panel_close)} position="left">
      <StyledCloseButton onClick={handleOnBtnCloseClick}>
        <CrossIcon label="" size="medium" />
      </StyledCloseButton>
    </Tooltip>
  ) : null;
};

export default withAnalyticsEvents()(withHelp(injectIntl(CloseButton)));
