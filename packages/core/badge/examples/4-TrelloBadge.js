//@flow
import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Badge from '../src';

const stateThemes = {
  primary: {
    backgroundColor: colors.P400,
    textColor: colors.N0,
    borderRadius: '4px',
    padding: '3px 8px',
  },
};

const trelloButtonStyles = {
  paddingTop: '6px',
  paddingBottom: '6px',
};

const convert = ({ appearance }) => {
  return {
    ...stateThemes[appearance],
  };
};

type TrelloProps = {
  appearance: string,
  children: string,
};

const TBadge = (trelloProps: TrelloProps) => (
  <Badge
    appearance={trelloProps.appearance}
    theme={() => ({
      ...trelloButtonStyles,
      ...convert(trelloProps),
    })}
  >
    {trelloProps.children}
  </Badge>
);

// Implementation
export default () => (
  <div>
    <h3> Trello Card Label </h3>
    <TBadge appearance={'primary'}>Badge</TBadge>
    <h3> Atlaskit Default Badge </h3>
    <Badge appearance={'primary'}>Badge</Badge>
  </div>
);
