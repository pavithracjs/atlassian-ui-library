import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Email } from '../types';
import { AddOptionAvatar } from './AddOptionAvatar';
import { AvatarItemOption } from './AvatarItemOption';
import { messages } from './i18n';
import { EmailValidationResponse } from './emailValidation';

export type EmailOptionProps = {
  email: Email;
  isSelected: boolean;
  label?: string;
  emailValidity: EmailValidationResponse;
};

const getAddEmailMessage: (
  validity: EmailValidationResponse,
) => any = validity =>
  validity === 'POTENTIAL'
    ? messages.continueToAddEmail
    : messages.selectToAddEmail;

export class EmailOption extends React.PureComponent<EmailOptionProps> {
  private renderOption = (label: string) => (
    <AvatarItemOption
      avatar={<AddOptionAvatar label={label} />}
      primaryText={this.props.email.id}
      secondaryText={label}
    />
  );

  render() {
    const { label, emailValidity } = this.props;
    return label ? (
      this.renderOption(label)
    ) : (
      <FormattedMessage {...getAddEmailMessage(emailValidity)}>
        {label => this.renderOption(label as string)}
      </FormattedMessage>
    );
  }
}
