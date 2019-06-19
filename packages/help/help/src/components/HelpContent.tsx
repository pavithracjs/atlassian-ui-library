import * as React from 'react';
import ArrowleftIcon from '@atlaskit/icon/glyph/arrow-left';

import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '../messages';
import { REQUEST_STATE } from '../model/Requests';

import CloseButton from './CloseButton';
import { withHelp, HelpContextInterface } from './HelpContext';

import Search from './Search';
import ArticleComponent from './Article';
import Loading from './Loading';
import LoadingError from './LoadingError';
import {
  BackButton,
  BackButtonText,
  HelpHeader,
  HelpBody,
  HelpHeaderText,
} from './styled';

export interface Props {}

export const HelpContent = (
  props: Props & InjectedIntlProps & HelpContextInterface,
) => {
  const {
    help,
    intl: { formatMessage },
  } = props;

  if (help.articleState === REQUEST_STATE.done) {
    // Display HelpContext.mainArticle content if its defined and there isn't any
    // Article in the HelpContext.history[]
    if (help.mainArticle && help.history.length === 0) {
      return (
        <>
          <HelpHeader>
            <HelpHeaderText>
              {formatMessage(messages.help_panel_header)}
            </HelpHeaderText>
            <CloseButton />
          </HelpHeader>
          <HelpBody>
            {help.isSearchVisible() && <Search />}
            {help.isArticleVisible() && (
              <ArticleComponent article={help.mainArticle} />
            )}
          </HelpBody>
        </>
      );
    }

    // If there is one or more Articles in HelpContext.history[]
    // display the last one
    if (help.history.length > 0) {
      return (
        <>
          <HelpHeader>
            <HelpHeaderText>
              <BackButton onClick={help.navigateBack}>
                <ArrowleftIcon label="back" size="medium" />
                <BackButtonText>
                  {formatMessage(messages.help_panel_navigation_back)}
                </BackButtonText>
              </BackButton>
            </HelpHeaderText>
          </HelpHeader>

          <HelpBody>
            <ArticleComponent article={help.history[help.history.length - 1]} />
          </HelpBody>
        </>
      );
    }

    // Display the HelpContext.defaultContent
    if (!help.articleId && help.history.length === 0) {
      return (
        <>
          <HelpHeader>
            <HelpHeaderText>
              {formatMessage(messages.help_panel_header)}
            </HelpHeaderText>
            <CloseButton />
          </HelpHeader>
          <HelpBody>
            {help.isSearchVisible() && <Search />}
            {help.defaultContent}
          </HelpBody>
        </>
      );
    }
  }

  if (help.articleState === REQUEST_STATE.error) {
    return (
      <>
        <HelpHeader>
          <HelpHeaderText>
            {formatMessage(messages.help_panel_header)}
          </HelpHeaderText>
          <CloseButton />
        </HelpHeader>
        <HelpBody>
          <LoadingError />
        </HelpBody>
      </>
    );
  }

  return (
    <>
      <HelpHeader>
        <HelpHeaderText>
          {formatMessage(messages.help_panel_header)}
        </HelpHeaderText>
        <CloseButton />
      </HelpHeader>
      <HelpBody>
        {help.isSearchVisible() && <Search />}
        <Loading />
      </HelpBody>
    </>
  );
};

export default withHelp(injectIntl(HelpContent));
