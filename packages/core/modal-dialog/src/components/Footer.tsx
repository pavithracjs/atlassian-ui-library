import React from 'react';
import Button from '@atlaskit/button';

import { AppearanceType, ButtonOnClick } from '../types';
import { Actions, ActionItem, Footer } from '../styled/Content';

const JustifyShim = (props: any) => <span {...props} />;

export interface FooterProps {
  /** Buttons to render in the footer */
  actions?: Array<{
    onClick?: ButtonOnClick;
    text?: string;
  }>;
  /** Appearance of the primary button. Also adds an icon to the heading, if provided. */
  appearance?: AppearanceType;
  /** Component to render the footer of the modal */
  component?: React.ElementType;
  /** Function to close the dialog */
  onClose: Function;
  /** Whether or not to display a line above the footer */
  showKeyline?: boolean;
}

export default class ModalFooter extends React.Component<FooterProps, {}> {
  render() {
    const { actions, appearance, component, onClose, showKeyline } = this.props;
    const warning = 'You can provide `component` OR `actions`, not both.';

    if (!component && !actions) return null;
    if (component && actions) {
      console.warn(warning); // eslint-disable-line no-console
      return null;
    }
    if (component) {
      return React.createElement(component, {
        appearance,
        onClose,
        showKeyline,
      });
    }

    return (
      <Footer showKeyline={showKeyline}>
        <JustifyShim />
        <Actions>
          {actions
            ? actions.map(({ text, ...rest }, idx) => {
                const variant = idx !== 0 ? 'subtle' : appearance || 'primary';
                return (
                  <ActionItem key={text || idx}>
                    <Button
                      appearance={variant}
                      testId={`button-${variant}`}
                      {...rest}
                    >
                      {text}
                    </Button>
                  </ActionItem>
                );
              })
            : null}
        </Actions>
      </Footer>
    );
  }
}
