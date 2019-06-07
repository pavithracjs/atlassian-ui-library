import * as React from 'react';

interface AppearanceProps extends React.CSSProperties {
  appearance: any;
  backgroundColor: string;
  borderColor: string;
  groupAppearance: any;
  isActive: boolean;
  isDisabled: boolean;
  isFocus: boolean;
  isHover: boolean;
  isInteractive: boolean;
  isSelected: boolean;
  size: React.HTMLAttributes<HTMLElement>;
  stackIndex: string | number;
}
interface InteractionProps extends React.EventHandler<any> {
  onBlur: React.EventHandler<any>;
  onClick: React.EventHandler<any>;
  onFocus: React.EventHandler<any>;
  onKeyDown: React.KeyboardEvent;
  onKeyUp: React.KeyboardEvent;
  onMouseDown: React.MouseEvent;
  onMouseEnter: React.MouseEvent;
  onMouseLeave: React.MouseEvent;
  onMouseUp: React.MouseEvent;
  tabIndex: string | number;
}

type GetProps<P> = (props: P) => Partial<P>;

const getAppearanceProps: GetProps<AppearanceProps> = props => {
  const {
    appearance,
    backgroundColor,
    borderColor,
    groupAppearance,
    isActive,
    isDisabled,
    isFocus,
    isHover,
    isInteractive,
    isSelected,
    size,
    stackIndex,
  } = props;

  return {
    appearance,
    backgroundColor,
    borderColor,
    groupAppearance,
    isActive,
    isDisabled,
    isFocus,
    isHover,
    isInteractive,
    isSelected,
    size,
    stackIndex,
  };
};

const getInteractionProps: GetProps<InteractionProps> = props => {
  const {
    onBlur,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
    tabIndex,
  } = props;

  return {
    onBlur,
    onClick,
    onFocus,
    onKeyDown,
    onKeyUp,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
    tabIndex,
  };
};

const getLinkElementProps: GetProps<HTMLLinkElement> = props => {
  const { href, target } = props;

  // handle security issue for consumer
  // https://mathiasbynens.github.io/rel-noopener
  const rel = target === '_blank' ? 'noopener noreferrer' : null;

  return { href, rel, target };
};

const getButtonElementProps: GetProps<
  { isDisabled: boolean } & HTMLButtonElement
> = props => {
  const { id, isDisabled } = props;

  return { id, interface: 'button', disabled: isDisabled };
};

export default function getProps(
  component: React.ReactNode & { props: InteractionProps | AppearanceProps },
) {
  const { props } = component;

  const defaultProps = {
    ...getAppearanceProps(props),
    ...getInteractionProps(props),
  };

  if (props.component) {
    return {
      ...defaultProps,
      ...props,
    };
  }

  if (props.href) {
    if (props.isDisabled) {
      return defaultProps;
    }

    return {
      ...defaultProps,
      ...getLinkElementProps(props),
    };
  }

  if (props.onClick) {
    return {
      ...defaultProps,
      ...getButtonElementProps(props),
    };
  }

  return defaultProps;
}
