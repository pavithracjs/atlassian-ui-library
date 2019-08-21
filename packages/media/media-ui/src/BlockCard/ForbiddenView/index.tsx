import * as React from 'react';
import Button from '@atlaskit/button';
import { N0 } from '@atlaskit/theme/colors';
import LockFilledIcon from '@atlaskit/icon/glyph/lock-filled';
import { CollapsedFrame } from '../CollapsedFrame';
import { minWidth, maxWidth } from '../dimensions';
import { CollapsedIconTitleDescriptionLayout } from '../CollapsedIconTitleDescriptionLayout';
import { IconBackground } from './styled';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';

export interface BlockCardForbiddenViewProps {
  /** The url to display */
  url: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** The optional click handler */
  onAuthorise?: () => void;

  isSelected?: boolean;
}

export class BlockCardForbiddenView extends React.Component<
  BlockCardForbiddenViewProps
> {
  handleAuthorise = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { onAuthorise } = this.props;
    if (onAuthorise) {
      event.preventDefault();
      event.stopPropagation();
      onAuthorise();
    }
  };

  render() {
    const { url, onClick, onAuthorise, isSelected } = this.props;
    return (
      <CollapsedFrame
        isSelected={isSelected}
        minWidth={minWidth}
        maxWidth={maxWidth}
        onClick={onClick}
      >
        <CollapsedIconTitleDescriptionLayout
          icon={
            <IconBackground>
              <LockFilledIcon
                label="forbidden"
                size="medium"
                primaryColor={N0}
              />
            </IconBackground>
          }
          title={url}
          description={
            <>
              <FormattedMessage {...messages.invalid_permissions} />{' '}
              {onAuthorise && (
                <Button
                  appearance="link"
                  spacing="none"
                  onClick={this.handleAuthorise as () => void}
                >
                  <FormattedMessage {...messages.try_another_account} />
                </Button>
              )}
            </>
          }
        />
      </CollapsedFrame>
    );
  }
}
