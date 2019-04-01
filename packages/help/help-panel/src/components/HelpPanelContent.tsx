import * as React from 'react';
import CloseButton from './CloseButton';
import { withAnalytics } from '@atlaskit/analytics';
import ArrowleftIcon from '@atlaskit/icon/glyph/arrow-left';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { withHelp, HelpContextInterface } from './HelpContext';
import { messages } from '../messages';

import Search from './Search';
import ArticleComponent from './Article';
import {
  BackButton,
  HelpPanelHeader,
  HelpPanelBody,
  HelpPanelHeaderText,
} from './styled';

export interface Props {}

export const HelpPanelContent = (
  props: Props & InjectedIntlProps & HelpContextInterface,
) => {
  const {
    help,
    intl: { formatMessage },
  } = props;

  if (
    help.defaultArticle !== undefined &&
    help.defaultArticle !== null &&
    help.history.length === 0
  ) {
    return (
      <>
        <HelpPanelHeader>
          <HelpPanelHeaderText>
            {formatMessage(messages.help_panel_header)}
          </HelpPanelHeaderText>
          <CloseButton />
        </HelpPanelHeader>
        <HelpPanelBody>
          {help.isSearchVisible() && <Search />}
          {help.isArticleVisible() && (
            <ArticleComponent article={help.defaultArticle} />
          )}
        </HelpPanelBody>
      </>
    );
  }

  if (help.history.length > 0) {
    return (
      <>
        <HelpPanelHeader>
          <HelpPanelHeaderText>
            <BackButton onClick={help.navigateBack}>
              <ArrowleftIcon label="back" size="medium" />
              {formatMessage(messages.help_panel_navigation_back)}
            </BackButton>
          </HelpPanelHeaderText>
        </HelpPanelHeader>

        <HelpPanelBody>
          <ArticleComponent article={help.history[help.history.length - 1]} />
        </HelpPanelBody>
      </>
    );
  }

  return (
    <>
      <HelpPanelHeader>
        {formatMessage(messages.help_panel_header)}
      </HelpPanelHeader>
      {help.defaultContent}
    </>
  );
};

export default withAnalytics(withHelp(injectIntl(HelpPanelContent)), {}, {});
