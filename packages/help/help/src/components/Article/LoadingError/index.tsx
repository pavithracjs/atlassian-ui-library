import * as React from 'react';
import Button from '@atlaskit/button';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withHelp, HelpContextInterface } from '../../HelpContext';
import { messages } from '../../../messages';
import SomethingWrongImageFile from '../../../assets/SomethingWrong';

import { LoadingErrorMessage, LoadingErrorButtonContainer } from './styled';

export interface Props {}

export const LoadingError = ({
  help,
  intl: { formatMessage },
}: Props & InjectedIntlProps & HelpContextInterface) => {
  const handleOnClick = () => {
    help.loadArticle();
  };

  return (
    <LoadingErrorMessage>
      <div
        dangerouslySetInnerHTML={{
          __html: SomethingWrongImageFile,
        }}
      />
      <h2>{formatMessage(messages.help_panel_search_error_loading_title)}</h2>
      <p>{formatMessage(messages.help_panel_search_error_loading_text)}</p>
      <LoadingErrorButtonContainer>
        <Button onClick={handleOnClick}>
          {formatMessage(messages.help_panel_search_error_loading_button_label)}
        </Button>
      </LoadingErrorButtonContainer>
    </LoadingErrorMessage>
  );
};

export default withHelp(injectIntl(LoadingError));
