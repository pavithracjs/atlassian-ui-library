import * as React from 'react';
import { withAnalytics } from '@atlaskit/analytics';

import { VIEW } from './constants';
import { withHelp } from './HelpContext';

import Search from './Search';
import ArticleComponent from './Article';

export const HelpPanelContent = props => {
  const { help } = props;

  switch (help.view) {
    case VIEW.ARTICLE:
      return (
        <>
          {help.isSearchVisible() && <Search />}
          {help.isArticleVisible() && <ArticleComponent />}
        </>
      );

    default:
      return <>{help.defaultContent}</>;
  }
};

export default withAnalytics(withHelp(HelpPanelContent), {}, {});
