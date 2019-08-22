import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';

import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';
import { withAnalyticsEvents, withAnalyticsContext } from '../../analytics';
import { messages } from '../../messages';
import { Analytics } from '../../model/Analytics';

import CrossIcon from '@atlaskit/icon/glyph/cross';
import { CloseButtonContainer } from './styled';
import { withHelp, HelpContextInterface } from '../HelpContext';

export interface Props {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
}

const iconBefore = <CrossIcon label="" size="medium" />;

/**
 * This function will return a CloseButton component only if the function
 * to be executed on the onClick event is passed as a parameter
 *
 * @param onButtonCloseClick - Function executed when the close btn is clicked
 */

const CloseButton = (
  props: Props & HelpContextInterface & Analytics & InjectedIntlProps,
) => {
  const {
    help: { onButtonCloseClick },
    intl: { formatMessage },
    createAnalyticsEvent,
  } = props;

  const handleButtonCloseClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (onButtonCloseClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'click',
      });
      onButtonCloseClick(event, analyticsEvent);
    }
  };

  return onButtonCloseClick ? (
    <CloseButtonContainer>
      <Tooltip
        content={formatMessage(messages.help_panel_close)}
        position="left"
      >
        <Button
          onClick={handleButtonCloseClick}
          appearance="subtle"
          iconBefore={iconBefore}
        />
      </Tooltip>
    </CloseButtonContainer>
  ) : null;
};

export default withAnalyticsContext({
  componentName: 'closeButton',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(withHelp(injectIntl(CloseButton))));
