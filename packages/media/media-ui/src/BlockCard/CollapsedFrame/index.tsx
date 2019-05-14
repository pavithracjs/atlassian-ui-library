import * as React from 'react';
import { Wrapper } from './styled';

export interface CollapsedFrameProps {
  minWidth?: number;
  maxWidth?: number;
  children?: React.ReactNode;
  /** The optional click handler */
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  /** A flag that determines whether the card is selected in edit mode. */
  isSelected?: boolean;
}

export class CollapsedFrame extends React.Component<CollapsedFrameProps> {
  handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { onClick } = this.props;
    if (onClick) {
      event.preventDefault();
      event.stopPropagation();
      onClick(event);
    }
  };

  // imitate a button for accessibility reasons
  handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }
    const { onClick } = this.props;
    if (onClick) {
      event.preventDefault();
      event.stopPropagation();
      onClick(event);
    }
  };

  render() {
    const { isSelected, minWidth, maxWidth, children, onClick } = this.props;
    const isInteractive = Boolean(onClick);
    return (
      <Wrapper
        minWidth={minWidth}
        maxWidth={maxWidth}
        isInteractive={isInteractive}
        isSelected={isSelected}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        onClick={this.handleClick}
        onKeyPress={this.handleKeyPress}
      >
        {children}
      </Wrapper>
    );
  }
}
