import * as React from 'react';
import ArrowleftIcon from '@atlaskit/icon/glyph/arrow-left';
import * as colors from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { Transition } from 'react-transition-group';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Button from '@atlaskit/button';

import { messages } from '../../messages';
import { TRANSITION_DURATION_MS, TRANSITION_STATUS } from '../constants';

import { withHelp, HelpContextInterface } from '../HelpContext';
import CloseButton from './CloseButton';

import { HeaderContainer, HeaderTitle, BackButtonContainer } from './styled';

const buttonTheme = {
  color: colors.N90,
};

const defaultStyle = {
  transition: `left ${TRANSITION_DURATION_MS}ms, opacity ${TRANSITION_DURATION_MS}ms`,
  left: `${gridSize() * 3}px`,
  opacity: 0,
};

const transitionStyles: { [id: string]: React.CSSProperties } = {
  entered: { left: `${gridSize()}px`, opacity: 1 },
  exited: { left: `${gridSize()}px`, opacity: 0 },
};

export interface Props {}

export const HelpContent = (
  props: Props & InjectedIntlProps & HelpContextInterface,
) => {
  const {
    help,
    intl: { formatMessage },
  } = props;

  const isBackButtonVisible: () => boolean = () => {
    if (help.history.length === 1 && !help.isDefaultContent()) {
      return false;
    }

    return help.isArticleVisible();
  };

  return (
    <HeaderContainer>
      <Transition
        in={isBackButtonVisible()}
        timeout={TRANSITION_DURATION_MS}
        mountOnEnter
        unmountOnExit
      >
        {(state: TRANSITION_STATUS) => (
          <BackButtonContainer
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <Button
              onClick={help.navigateBack}
              appearance="subtle"
              theme={(currentTheme: any, themeProps: any) => {
                const { buttonStyles, ...rest } = currentTheme(themeProps);
                return {
                  buttonStyles: {
                    ...buttonStyles,
                    ...buttonTheme,
                  },
                  ...rest,
                };
              }}
              iconBefore={<ArrowleftIcon label="back" size="medium" />}
            >
              {formatMessage(messages.help_panel_navigation_back)}
            </Button>
          </BackButtonContainer>
        )}
      </Transition>
      <HeaderTitle>{formatMessage(messages.help_panel_header)}</HeaderTitle>
      <CloseButton />
    </HeaderContainer>
  );
};

export default withHelp(injectIntl(HelpContent));
