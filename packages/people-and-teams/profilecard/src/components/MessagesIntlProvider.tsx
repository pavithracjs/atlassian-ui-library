import * as React from 'react';
import { IntlProvider, injectIntl } from 'react-intl';
import { getMessagesForLocale } from '../internal/i18n-util';
import { MessageIntlProviderProps } from '../types';

class MessagesIntlProvider extends React.PureComponent<
  MessageIntlProviderProps
> {
  render() {
    const { intl, children } = this.props;

    return (
      <IntlProvider messages={getMessagesForLocale(intl.locale)}>
        {children}
      </IntlProvider>
    );
  }
}

export default injectIntl(MessagesIntlProvider);
