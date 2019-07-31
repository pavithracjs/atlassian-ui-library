import React, { Component, ReactNode } from 'react';
import { Anchor, Span } from '../styled/FieldStyles';

interface Props {
  hasAuthor?: boolean;
  children?: ReactNode;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  onFocus?: (event: React.FocusEvent<HTMLSpanElement>) => void;
  onMouseOver?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

export default class CommentField extends Component<Props> {
  render() {
    const {
      children,
      hasAuthor,
      href,
      onClick,
      onFocus,
      onMouseOver,
    } = this.props;
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return href ? (
      <Anchor
        href={href}
        hasAuthor={hasAuthor}
        onClick={onClick}
        onFocus={onFocus}
        onMouseOver={onMouseOver}
      >
        {children}
      </Anchor>
    ) : (
      <Span
        hasAuthor={hasAuthor}
        onClick={onClick}
        onFocus={onFocus}
        onMouseOver={onMouseOver}
      >
        {children}
      </Span>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }
}
