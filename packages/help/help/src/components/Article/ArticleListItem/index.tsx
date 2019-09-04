import * as React from 'react';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import { withAnalyticsEvents, withAnalyticsContext } from '../../../analytics';
import { Analytics } from '../../../model/Analytics';

import {
  ArticlesListItemTitleIcon,
  ArticlesListItemWrapper,
  ArticlesListItemTitle,
  ArticlesListItemTitleText,
  ArticlesListItemDescription,
} from './styled';

interface Props {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  onClick: (id: string, analyticsEvent: UIAnalyticsEvent) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  id: string;
}

const ArticlesListItem = (props: Props & Analytics) => {
  const { id, title, description, icon, onClick, createAnalyticsEvent } = props;

  const handleOnClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (onClick) {
      const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
        action: 'click',
      });

      onClick(id, analyticsEvent);
    }
  };

  return (
    <ArticlesListItemWrapper
      aria-disabled="false"
      role="button"
      href=""
      onClick={handleOnClick}
    >
      <ArticlesListItemTitle>
        <ArticlesListItemTitleIcon>{icon}</ArticlesListItemTitleIcon>
        <ArticlesListItemTitleText>{title}</ArticlesListItemTitleText>
      </ArticlesListItemTitle>
      <ArticlesListItemDescription>{description}</ArticlesListItemDescription>
    </ArticlesListItemWrapper>
  );
};

export default withAnalyticsContext({
  componentName: 'ArticleListItem',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(ArticlesListItem));
