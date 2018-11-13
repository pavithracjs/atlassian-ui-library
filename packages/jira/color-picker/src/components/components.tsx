import * as React from 'react';
import { Color } from '../types';
import ColorCard from './ColorCard';
import {
  ColorPaletteContainer,
  ColorCardWrapper,
} from '../styled/ColorPalette';

const EmptyComponent = () => null;

export interface SelectComponentProps {
  // select props
  data: Color;
  options: Color[];
  setValue: (option: Color) => void;
  getValue: () => Color[];
  selectProps: {
    selectedLabel?: string;
    cols?: number;
    checkMarkColor?: string;
    focusedItemIndex: number;
  };
  isFocused: boolean;
  isSelected: boolean;
  innerProps: {};
}

export const MenuList = (props: SelectComponentProps) => {
  const { cols } = props.selectProps;

  return (
    <ColorPaletteContainer
      style={{ maxWidth: cols ? cols * 28 + 12 : undefined }}
      {...props}
    />
  );
};

export const Option = (props: SelectComponentProps) => {
  const {
    data: { value },
    selectProps: { checkMarkColor },
    isFocused,
    isSelected,
  } = props;

  return (
    <ColorCardWrapper {...props.innerProps}>
      <ColorCard
        value={value}
        checkMarkColor={checkMarkColor}
        isOption
        focused={isFocused}
        selected={isSelected}
      />
    </ColorCardWrapper>
  );
};

export const DropdownIndicator = EmptyComponent;

export const Placeholder = EmptyComponent;
