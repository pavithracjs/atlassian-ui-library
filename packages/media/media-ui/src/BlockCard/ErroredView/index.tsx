import * as React from 'react';
import Button from '@atlaskit/button';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { Y300 } from '@atlaskit/theme/colors';
import { CollapsedFrame } from '../CollapsedFrame';
import { minWidth, maxWidth } from '../dimensions';
import { CollapsedIconTitleDescriptionLayout } from '../CollapsedIconTitleDescriptionLayout';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';

export interface BlockCardErroredViewProps {
  /** The url to display */
  url: string;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** The error message to display */
  message: string;
  /** What to do when a user clicks "Try again" button. */
  onRetry?: () => void;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
}

export class BlockCardErroredView extends React.Component<
  BlockCardErroredViewProps
> {
  handleRetry = (event: React.MouseEvent<HTMLElement>) => {
    const { onRetry } = this.props;
    if (onRetry) {
      event.preventDefault();
      event.stopPropagation();
      onRetry();
    }
  };

  render() {
    const { url, message, onClick, onRetry, isSelected } = this.props;
    return (
      <CollapsedFrame
        isSelected={isSelected}
        minWidth={minWidth}
        maxWidth={maxWidth}
        onClick={onClick}
      >
        <CollapsedIconTitleDescriptionLayout
          icon={<WarningIcon label="error" size="medium" primaryColor={Y300} />}
          title={url}
          description={
            <>
              {message}{' '}
              {onRetry && (
                <Button
                  appearance="link"
                  spacing="none"
                  onClick={this.handleRetry}
                >
                  <FormattedMessage {...messages.try_again} />
                </Button>
              )}
            </>
          }
        />
      </CollapsedFrame>
    );
  }
}
