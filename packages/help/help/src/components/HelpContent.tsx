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
import { Article } from 'src/model/Article';

export interface Props {}

export const HelpContent = (
  props: Props & InjectedIntlProps & HelpContextInterface,
) => {
  const {
    help,
    intl: { formatMessage },
  } = props;

  if (help.articleState === REQUEST_STATE.done) {
    let articleToDisplay: Article | undefined;

    if (help.mainArticle && help.history.length === 0) {
      articleToDisplay = help.mainArticle;
    } else if (help.history.length > 0) {
      articleToDisplay = help.history[help.history.length - 1];
    }

    return (
      <>
        <HelpHeader>
          <HelpHeaderText>
            {articleToDisplay ? (
              <BackButton onClick={help.navigateBack}>
                <ArrowleftIcon label="back" size="medium" />
                <BackButtonText>
                  {formatMessage(messages.help_panel_navigation_back)}
                </BackButtonText>
              </BackButton>
            ) : (
              formatMessage(messages.help_panel_header)
            )}
          </HelpHeaderText>
          <CloseButton />
        </HelpHeader>
        <HelpBody>
          {help.isSearchVisible() && <Search />}
          {articleToDisplay ? (
            <ArticleComponent article={articleToDisplay} />
          ) : null}
          {help.defaultContent}
        </HelpBody>
      </>
    );
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
