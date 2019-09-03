import chromatism, { ColourModes } from 'chromatism';

import { AppNavigationTheme, ModeContext } from './types';

type Modifier = Omit<ColourModes.HSL, 'h'>;

type Modifiers = {
  active: Modifier;
  focus: Modifier;
  hover: Modifier;
};

type ColorMatrix = Modifiers & {
  when: (color: ColourModes.HSL) => boolean;
};

const colorMatrix: ColorMatrix[] = [
  {
    // Dark
    when: ({ l }) => l <= 20,
    active: { s: -4, l: 8 },
    focus: { s: -8, l: 12 },
    hover: { s: 0, l: 16 },
  },
  {
    // Bright and saturated
    when: ({ s, l }) => s > 65 && l > 30,
    active: { s: -16, l: 8 },
    focus: { s: 0, l: -8 },
    hover: { s: -16, l: 12 },
  },
  {
    // Bright and dull
    when: ({ s, l }) => s <= 20 && l > 90,
    active: { s: 0, l: -4 },
    focus: { s: 0, l: -6 },
    hover: { s: 0, l: -2 },
  },
  {
    // Pastel
    when: ({ s, l }) => s > 20 && s < 50 && l > 50,
    active: { s: 8, l: -4 },
    focus: { s: 8, l: -12 },
    hover: { s: 24, l: 2 },
  },
  {
    // Dull
    when: ({ s, l }) => s <= 20 && l <= 90,
    active: { s: 0, l: -4 },
    focus: { s: 0, l: -8 },
    hover: { s: 0, l: 4 },
  },
];

const defaultModifiers: Modifiers = {
  active: { s: 0, l: 4 },
  focus: { s: 8, l: -6 },
  hover: { s: 0, l: 8 },
};

export type Colors = {
  backgroundColor: string;
  color: string;
};

const getColor = (baseColor: ColourModes.HSL, modifier: Modifier) =>
  chromatism.convert({
    ...baseColor,
    s: Math.max(0, Math.min(100, baseColor.s + modifier.s)),
    l: Math.max(0, Math.min(100, baseColor.l + modifier.l)),
  }).hex;

const getModifierStates = ({ backgroundColor, color }: Colors) => {
  const baseBackgroundColor = chromatism.convert(backgroundColor).hsl;

  const getState = (modifier: Modifier) => {
    const stateBackgroundColor = getColor(baseBackgroundColor, modifier);
    return {
      backgroundColor: stateBackgroundColor,
      color,
    };
  };

  const backgroundColorModifiers =
    colorMatrix.find(cm => cm.when(baseBackgroundColor)) || defaultModifiers;

  return {
    active: getState(backgroundColorModifiers.active),
    focus: getState(backgroundColorModifiers.focus),
    hover: getState(backgroundColorModifiers.hover),
  };
};

const generateModeContext = (colors: Colors): ModeContext => {
  return {
    default: colors,
    ...getModifierStates(colors),
  };
};

export type GenerateThemeArgs = {
  primary: Colors;
  secondary?: Colors;
};

export const generateTheme = (args: GenerateThemeArgs): AppNavigationTheme => {
  const primary = generateModeContext(args.primary);
  const secondary = args.secondary
    ? generateModeContext(args.secondary)
    : generateModeContext(primary.focus);

  return {
    mode: {
      create: secondary,
      iconButton: primary,
      navigation: primary.default,
      primaryButton: primary,
      search: primary.active,
      skeleton: {
        backgroundColor: chromatism.contrastRatio(
          primary.default.backgroundColor,
        ).hex,
      },
    },
  };
};
