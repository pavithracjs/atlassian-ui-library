import { colors } from '@atlaskit/theme';

interface AppearanceProps {
  isChecked: boolean;
  isDisabled: boolean;
  isHovered: boolean;
  isPressed: boolean;
}

export function getInputBackground({
  isChecked,
  isDisabled,
  isHovered,
  isPressed,
}: AppearanceProps) {
  let background = colors.N40;

  if (isHovered) background = colors.N50;
  if (isPressed) background = colors.B200;
  if (isChecked) background = colors.B400;
  if (isDisabled) background = colors.N20;
  if (isChecked && isDisabled) background = colors.N600;

  return background;
}

export function getInputFill(appearanceProps: AppearanceProps) {
  return appearanceProps.isChecked ? colors.N0 : 'transparent';
}
