// @flow

import type { Node } from 'react';

export type InteractionState = {|
  isActive: boolean,
  isHover: boolean,
  isFocused: boolean,
|};

export type InteractionStateProps = {|
  isSelected: boolean,
  children: InteractionState => Node,
|};
