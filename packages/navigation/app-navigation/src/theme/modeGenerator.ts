import chromatism, { ColourModes } from 'chromatism';

import { Mode, ModeContext } from './types';

type Modifier = Omit<ColourModes.HSL, 'h'>;

type Modifiers = {
  active: Modifier;
  focus: Modifier;
  hover: Modifier;
  subtle: Modifier;
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
    subtle: { s: -8, l: 12 },
  },
  {
    // Bright and saturated
    when: ({ s, l }) => s > 65 && l > 30,
    active: { s: -16, l: 8 },
    focus: { s: 0, l: -8 },
    hover: { s: -16, l: 12 },
    subtle: { s: 0, l: -8 },
  },
  {
    // Bright and dull
    when: ({ s, l }) => s <= 20 && l > 90,
    active: { s: 0, l: -4 },
    focus: { s: 0, l: -6 },
    hover: { s: 0, l: -2 },
    subtle: { s: 0, l: -6 },
  },
  {
    // Pastel
    when: ({ s, l }) => s > 20 && s < 50 && l > 50,
    active: { s: 8, l: -4 },
    focus: { s: 8, l: -12 },
    hover: { s: 24, l: 2 },
    subtle: { s: 8, l: -12 },
  },
  {
    // Dull
    when: ({ s, l }) => s <= 20 && l <= 90,
    active: { s: 0, l: -4 },
    focus: { s: 0, l: -8 },
    hover: { s: 0, l: 4 },
    subtle: { s: 0, l: -8 },
  },
];

const defaultModifiers: Modifiers = {
  active: { s: 0, l: 4 },
  focus: { s: 8, l: -6 },
  hover: { s: 0, l: 8 },
  subtle: { s: 8, l: -6 },
};

const getColor = (baseColor: ColourModes.HSL, modifier: Modifier) =>
  chromatism.convert({
    ...baseColor,
    s: baseColor.s + modifier.s,
    l: baseColor.l + modifier.l,
  }).hex;

const getModifierStates = ({ backgroundColor, color }: Colors) => {
  const baseBackgroundColor = chromatism.convert(backgroundColor).hsl;
  const baseColor = chromatism.convert(color).hsl;

  const getState = (
    backgroundColorModifier: Modifier,
    colorModifier: Modifier,
  ) => ({
    backgroundColor: getColor(baseBackgroundColor, backgroundColorModifier),
    color: getColor(baseColor, colorModifier),
  });

  const backgroundColorModifiers =
    colorMatrix.find(cm => cm.when(baseBackgroundColor)) || defaultModifiers;
  const colorModifiers =
    colorMatrix.find(cm => cm.when(baseColor)) || defaultModifiers;

  return {
    active: getState(backgroundColorModifiers.active, colorModifiers.active),
    focus: getState(backgroundColorModifiers.focus, colorModifiers.focus),
    hover: getState(backgroundColorModifiers.hover, colorModifiers.hover),
    subtle: getState(backgroundColorModifiers.subtle, colorModifiers.subtle),
  };
};

export type Colors = {
  backgroundColor: string;
  color: string;
};

const generateModeContext = (colors: Colors): ModeContext => {
  return {
    default: colors,
    ...getModifierStates(colors),
  };
};

export type GenerateModeArgs = {
  primary: Colors;
  secondary?: Colors;
};

export const generateMode = (args: GenerateModeArgs): Mode => {
  const primary = generateModeContext(args.primary);
  return {
    primary,
    secondary: args.secondary
      ? generateModeContext(args.secondary)
      : generateModeContext(primary.hover),
  };
};
