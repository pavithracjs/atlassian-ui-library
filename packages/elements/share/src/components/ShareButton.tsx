import Button, { ButtonAppearances } from '@atlaskit/button';
import ShareIcon from '@atlaskit/icon/glyph/share';
import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '../i18n';

export type Props = {
  appearance?: ButtonAppearances;
  isLoading?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  text?: React.ReactNode;
};

export const ShareButton: React.StatelessComponent<
  Props & InjectedIntlProps
> = ({ intl: { formatMessage }, text, ...props }) => (
  <Button
    {...props}
    iconBefore={
      <ShareIcon label={formatMessage(messages.shareTriggerButtonIconLabel)} />
    }
  >
    {text}
  </Button>
);

export default injectIntl(ShareButton);
