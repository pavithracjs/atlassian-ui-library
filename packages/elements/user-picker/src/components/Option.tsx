import { components } from '@atlaskit/select';
import * as React from 'react';
import { Option as OptionType } from '../types';
import { EmailOption } from './EmailOption';
import { TeamOption } from './TeamOption';
import { UserOption } from './UserOption';
import { isEmail, isTeam, isUser } from './utils';
import { isValidEmail } from './emailValidation';

export type OptionProps = {
  data: OptionType;
  isSelected: boolean;
  status?: string;
  selectProps: {
    emailLabel?: string;
  };
};

const dataOption = ({
  data: { data },
  isSelected,
  status,
  selectProps,
}: OptionProps) => {
  if (isUser(data)) {
    return <UserOption user={data} status={status} isSelected={isSelected} />;
  }
  if (isEmail(data)) {
    return (
      <EmailOption
        email={data}
        emailValidity={isValidEmail(data.id)}
        isSelected={isSelected}
        label={selectProps.emailLabel}
      />
    );
  }
  if (isTeam(data)) {
    return <TeamOption team={data} isSelected={isSelected} />;
  }
  return null;
};

export const Option: React.StatelessComponent<OptionProps> = props => (
  <components.Option {...props}>{dataOption(props)}</components.Option>
);
