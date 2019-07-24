import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import UserPicker, {
  EmailValidationResponse,
  LoadOptions,
  OptionData,
  Value,
  isValidEmail,
} from '@atlaskit/user-picker';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { messages } from '../i18n';
import {
  ConfigResponse,
  ConfigResponseMode,
  FieldChildrenArgs,
  MessageDescriptor,
} from '../types';
import {
  allowEmails,
  isValidEmailUsingConfig,
  showInviteWarning,
} from './utils';

export const REQUIRED = 'REQUIRED';
const validate = (value: OptionData[]) =>
  value && value.length > 0 ? undefined : REQUIRED;

export type Props = {
  loadOptions?: LoadOptions;
  defaultValue?: OptionData[];
  config?: ConfigResponse;
  capabilitiesInfoMessage?: React.ReactNode;
  isLoading?: boolean;
};

type GetPlaceHolderMessageDescriptor = (
  mode: ConfigResponseMode | '',
) => MessageDescriptor;

type GetNoOptionMessageDescriptor = (
  mode: ConfigResponseMode | '',
  emailValidity: EmailValidationResponse,
) => MessageDescriptor;

type GetNoOptionMessage = (params: { inputValue: string }) => any;

const getNoOptionsMessageDescriptor: GetNoOptionMessageDescriptor = (
  mode: ConfigResponseMode | '',
  emailValidity: EmailValidationResponse,
) => {
  switch (mode) {
    case 'EXISTING_USERS_ONLY':
      return messages.userPickerExistingUserOnlyNoOptionsMessage;

    case 'ONLY_DOMAIN_BASED_INVITE':
      if (emailValidity !== 'INVALID') {
        return messages.userPickerDomainBasedUserOnlyNoOptionsMessage;
      } else {
        return messages.userPickerGenericNoOptionsMessage;
      }

    default:
      return messages.userPickerGenericNoOptionsMessage;
  }
};

const getNoOptionsMessage = (
  config: ConfigResponse | undefined,
): GetNoOptionMessage => ({
  inputValue,
}: {
  inputValue: string;
}): GetNoOptionMessage =>
  inputValue && inputValue.trim().length > 0
    ? ((
        <FormattedMessage
          {...getNoOptionsMessageDescriptor(
            (config && config!.mode) || '',
            isValidEmail(inputValue),
          )}
          values={{
            inputValue,
            domains: (
              <strong>
                {((config && config!.allowedDomains) || []).join(', ')}
              </strong>
            ),
          }}
        />
      ) as any)
    : null;

const getPlaceHolderMessageDescriptor: GetPlaceHolderMessageDescriptor = (
  mode: ConfigResponseMode | '',
) =>
  mode === 'EXISTING_USERS_ONLY'
    ? messages.userPickerExistingUserOnlyPlaceholder
    : messages.userPickerGenericPlaceholder;

export class UserPickerField extends React.Component<Props> {
  private loadOptions = (search?: string) => {
    const { loadOptions } = this.props;
    if (loadOptions && search && search.length > 0) {
      return loadOptions(search);
    } else {
      return [];
    }
  };

  render() {
    const {
      defaultValue,
      config,
      capabilitiesInfoMessage,
      isLoading,
    } = this.props;
    const configMode = (config && config!.mode) || '';
    return (
      <Field name="users" validate={validate} defaultValue={defaultValue}>
        {({ fieldProps, error, meta: { valid } }: FieldChildrenArgs<Value>) => (
          <>
            <FormattedMessage {...messages.userPickerAddMoreMessage}>
              {addMore => (
                <UserPicker
                  {...fieldProps}
                  fieldId="share"
                  loadOptions={this.loadOptions}
                  isMulti
                  width="100%"
                  placeholder={
                    <FormattedMessage
                      {...getPlaceHolderMessageDescriptor(configMode)}
                    />
                  }
                  addMoreMessage={addMore as string}
                  allowEmail={allowEmails(config)}
                  isValidEmail={isValidEmailUsingConfig(config)}
                  noOptionsMessage={getNoOptionsMessage(config)}
                  isLoading={isLoading}
                />
              )}
            </FormattedMessage>
            {showInviteWarning(config, fieldProps.value) && (
              <HelperMessage>
                {capabilitiesInfoMessage || (
                  <FormattedMessage {...messages.capabilitiesInfoMessage} />
                )}
              </HelperMessage>
            )}
            {!valid && error === REQUIRED && (
              <ErrorMessage>
                <FormattedMessage {...messages.userPickerRequiredMessage} />
              </ErrorMessage>
            )}
          </>
        )}
      </Field>
    );
  }
}
