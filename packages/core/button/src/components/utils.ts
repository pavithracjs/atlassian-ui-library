import * as React from 'react';
import isPropValid from '@emotion/is-prop-valid';
import { ButtonProps } from '../types';

export const mapAttributesToState = ({
  isDisabled = false,
  isActive = false,
  isFocus = false,
  isHover = false,
  isSelected = false,
}) => {
  if (isDisabled) return 'disabled';
  if (isSelected && isFocus) return 'focusSelected';
  if (isSelected) return 'selected';
  if (isActive) return 'active';
  if (isHover) return 'hover';
  if (isFocus) return 'focus';
  return 'default';
};

export const filteredProps = (props: ButtonProps, type: React.ReactNode) => {
  if (props.component) return props;

  // Remove `href` and `target` if component type is `span`.
  let newProps = props;
  if (type === 'span') {
    const { target, href, ...rest } = props;
    newProps = rest;
  }

  return (Object.keys(newProps) as Array<keyof ButtonProps>)
    .filter(isPropValid)
    .reduce(
      (filteredProps, prop) => ({
        ...filteredProps,
        [prop]: newProps[prop],
      }),
      {},
    );
};
