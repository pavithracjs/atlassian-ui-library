import React, {
  PureComponent,
  ReactNode,
  FocusEvent,
  KeyboardEvent,
} from 'react';
import { Span } from './styled';
import { TagColor } from '../types';

interface Props {
  children: ReactNode;
  isLink: boolean;
  isRemovable: boolean;
  isRemoved?: boolean;
  isRemoving?: boolean;
  isRounded?: boolean;
  markedForRemoval: boolean;
  onFocusChange: (focused: boolean) => void;
  color: TagColor;
}

export interface SpanProps extends Props {
  innerRef: (r: HTMLElement) => void;
  onBlur: () => void;
  onFocus: (e: FocusEvent<HTMLElement>) => void;
  onKeyPress: (e: KeyboardEvent<HTMLSpanElement>) => void;
  role: string;
  tabIndex: number;
}

export default class Chrome extends PureComponent<Props> {
  chromeRef?: HTMLElement;

  handleKeyPress = (e: KeyboardEvent<HTMLSpanElement>) => {
    const spacebarOrEnter = e.key === ' ' || e.key === 'Enter';

    if (this.chromeRef && spacebarOrEnter) {
      const link = this.chromeRef.querySelector('a');
      if (link) link.click();
    }
  };

  handleBlur = () => {
    this.props.onFocusChange(false);
  };

  handleFocus = (e: FocusEvent<HTMLElement>) => {
    if (e.target === this.chromeRef) this.props.onFocusChange(true);
  };

  render() {
    const {
      children,
      isLink,
      isRemovable,
      isRemoved,
      isRemoving,
      isRounded,
      markedForRemoval,
      color,
    } = this.props;

    // @ts-ignore (children *are* in SpanProps)
    const spanProps: SpanProps = {
      innerRef: (r: HTMLElement) => {
        this.chromeRef = r;
      },
      isRemovable,
      isRemoved,
      isRemoving,
      isRounded,
      markedForRemoval,
      onBlur: this.handleBlur,
      onFocus: this.handleFocus,
      onKeyPress: this.handleKeyPress,
      tabIndex: -1,
      color,
      role: '',
    };

    if (isLink) {
      spanProps.role = 'link';
      spanProps.tabIndex = 0;
    }

    return <Span {...spanProps}>{children}</Span>;
  }
}
