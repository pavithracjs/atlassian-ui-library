import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  CreateUIAnalyticsEventSignature,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import Button from '@atlaskit/button';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { withAnalyticsEvents, withAnalyticsContext } from '../../../analytics';
import { messages } from '../../../messages';
import { Analytics } from '../../../model/Analytics';

import { withHelp, HelpContextInterface } from '../../HelpContext';

export interface Props {
  onClick?: () => void;
  isSelected?: boolean;
  createAnalyticsEvent?: CreateUIAnalyticsEventSignature;
}

const ArticleWasHelpfulNoButton = (
  props: Props & HelpContextInterface & Analytics & InjectedIntlProps,
) => {
  const {
    help: { onWasHelpfulNoButtonClick },
    intl: { formatMessage },
    createAnalyticsEvent,
    isSelected,
    onClick,
  } = props;

  const handleButtonClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (onClick) {
      onClick();
    }

    if (onWasHelpfulNoButtonClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'click',
      });
      onWasHelpfulNoButtonClick(event, analyticsEvent);
    }
  };

  return (
    <Button onClick={handleButtonClick} isSelected={isSelected}>
      {formatMessage(messages.help_panel_article_rating_option_no)}
    </Button>
  );
};

export default withAnalyticsContext<Props>({
  componentName: 'ArticleWasHelpfulNoButton',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents<Props>()(withHelp(injectIntl(ArticleWasHelpfulNoButton))),
);
