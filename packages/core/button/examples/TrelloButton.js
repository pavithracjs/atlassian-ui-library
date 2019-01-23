//@flow
import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Button from '../src';

const stateThemes = {
  primary: {
    default: {
      backgroundColor: colors.P400,
      color: colors.N0,
      width: '100px',
    },
    focus: {
      boxShadowColors: colors.P100,
    },
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
  children: React.Element<any>,
};

const TButton = (trelloProps: TrelloProps) => (
  <Button
    appearance={trelloProps.appearance}
    theme={() => ({
      ...trelloButtonStyles,
      ...convert(trelloProps),
    })}
  >
    {trelloProps.children}
  </Button>
);

// Implementation
export default () => (
  <div>
    <h3> Trello Button </h3>
    <TButton appearance={'primary'}>Button</TButton>
    <h3> Default Button </h3>
    <Button appearance={'primary'}>Button</Button>
  </div>
);
