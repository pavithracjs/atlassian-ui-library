import { ErrorMessage, Field, HelperMessage } from '@atlaskit/form';
import UserPicker, {
  LoadOptions,
  OptionData,
  Value,
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
};

type GetMessageDescriptorByConfigMode = (
  mode: ConfigResponseMode | '',
) => MessageDescriptor;

type GetNoOptionMessage = (
  { inputValue }: { inputValue: string },
) => any | null;

const noOptionsMessageProps: GetMessageDescriptorByConfigMode = mode =>
  mode === 'EXISTING_USERS_ONLY'
    ? messages.userPickerExistingUserOnlyNoOptionsMessage
    : messages.userPickerGenericNoOptionsMessage;

const getNoOptionsMessageByConfigMode = (
  mode: ConfigResponseMode | '',
): GetNoOptionMessage => ({ inputValue }): GetNoOptionMessage =>
  inputValue && inputValue.trim().length > 0
    ? ((
        <FormattedMessage
          {...noOptionsMessageProps(mode)}
          values={{ inputValue }}
        />
      ) as any)
    : null;

const getPlaceHolderMessage: GetMessageDescriptorByConfigMode = mode =>
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
    const { defaultValue, config, capabilitiesInfoMessage } = this.props;
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
                    <FormattedMessage {...getPlaceHolderMessage(configMode)} />
                  }
                  addMoreMessage={addMore as string}
                  allowEmail={allowEmails(config)}
                  isValidEmail={isValidEmailUsingConfig(config)}
                  noOptionsMessage={getNoOptionsMessageByConfigMode(configMode)}
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
