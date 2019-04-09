// @flow
import React, { Component, type ElementType } from 'react';
import uuid from 'uuid/v1';
import Button from '@atlaskit/button';
import Container, { Action } from './styledFlagActions';
import type { ActionsType, AppearanceTypes } from '../../types';
import { actionButtonStyles, getPseudos } from '../../theme';
import { DEFAULT_APPEARANCE } from '../Flag';

type Props = {
  appearance: AppearanceTypes,
  actions: ActionsType,
  linkComponent?: ElementType,
};

export default class FlagActions extends Component<Props, {}> {
  props: Props;

  // eslint-disable-line react/sort-comp
  static defaultProps = {
    appearance: DEFAULT_APPEARANCE,
    actions: [],
  };

  getUniqueId = (prefix: string): string => `${prefix}-${uuid()}`;

  render() {
    const { actions, appearance, linkComponent } = this.props;
    const isBold = appearance !== DEFAULT_APPEARANCE;

    if (!actions.length) return null;
    return (
      <Container>
        {actions.map((action, index) => (
          <Action
            key={this.getUniqueId('flag-action')}
            hasDivider={!!index}
            useMidDot={!isBold}
          >
            <Button
              onClick={action.onClick}
              href={action.href}
              target={action.target}
              // This is very much a hack
              // This should be tidied up when the appearance prop
              // of flag is aligned with other appearance props.
              appearance={appearance === 'normal' ? 'link' : appearance}
              component={linkComponent}
              spacing="compact"
              theme={(adgTheme, themeProps) => {
                const { buttonStyles, ...rest } = adgTheme(themeProps);
                return {
                  buttonStyles: {
                    ...buttonStyles,
                    ...actionButtonStyles({
                      appearance,
                      mode: themeProps.mode,
                    }),
                    ...getPseudos({ appearance, mode: themeProps.mode }),
                  },
                  ...rest,
                };
              }}
            >
              {action.content}
            </Button>
          </Action>
        ))}
      </Container>
    );
  }
}
