// @flow
import styled from 'styled-components';
import { colors, themed } from '@atlaskit/theme';
import { messaging } from '@atlaskit/design-tokens';
import { itemSpacing } from '../../constants';
import type { IconType } from '../../types';

type Props = {
  appearance: IconType,
  isHovered: ?boolean,
  isOpen: ?boolean,
};

const {
  colors: { text, warning, destructive, info, confirmation, change },
} = messaging;

type themedType = (appearance: Props) => (string: string) => string;

// $FlowFixMe - theme is not found in props
const getBaseColor: themedType = themed('appearance', {
  connectivity: { light: info.normal.icon.resting, dark: colors.B100 },
  confirmation: { light: confirmation.normal.icon.resting, dark: colors.G300 },
  info: { light: change.normal.icon.resting, dark: colors.P300 },
  warning: { light: warning.normal.icon.resting, dark: colors.Y300 },
  error: { light: destructive.normal.icon.resting, dark: colors.R400 },
});

const getHoverColor: themedType = themed('appearance', {
  connectivity: { light: info.normal.icon.highlight, dark: colors.B75 },
  confirmation: {
    light: confirmation.normal.icon.highlight,
    dark: colors.G200,
  },
  info: { light: change.normal.icon.highlight, dark: colors.P200 },
  warning: { light: warning.normal.icon.highlight, dark: colors.Y200 },
  error: { light: destructive.normal.icon.highlight, dark: colors.R300 },
});

const getColor = (props: Props) => {
  if (props.isHovered || props.isOpen) return getHoverColor(props);
  return getBaseColor(props);
};

const IconWrapper = styled.span`
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  padding: 0 ${itemSpacing};
  color: ${getColor};
`;

export default IconWrapper;
