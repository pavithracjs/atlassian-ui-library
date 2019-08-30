import chromatism, { ColourModes } from 'chromatism';

import { AppNavigationMode, ContextColors } from './types';

type Modifier = Omit<ColourModes.HSL, 'h'>;

type Modifiers = {
  hint: Modifier;
  interact: Modifier;
  static: Modifier;
};

type ColorMatrix = Modifiers & {
  when: (color: ColourModes.HSL) => boolean;
};

const colorMatrix: ColorMatrix[] = [
  {
    // Dark
    when: ({ l }) => l <= 20,
    hint: { s: 0, l: 16 },
    interact: { s: -4, l: 8 },
    static: { s: -8, l: 12 },
  },
  {
    // bright and saturated
    when: ({ s, l }) => s > 65 && l > 30,
    hint: { s: -16, l: 12 },
    interact: { s: -16, l: 8 },
    static: { s: 0, l: -8 },
  },
  {
    // bright and dull
    when: ({ s, l }) => s <= 20 && l > 90,
    hint: { s: 0, l: -2 },
    interact: { s: 0, l: -4 },
    static: { s: 0, l: -6 },
  },
  {
    // pastel
    when: ({ s, l }) => s > 20 && s < 50 && l > 50,
    hint: { s: 24, l: 2 },
    interact: { s: 8, l: -4 },
    static: { s: 8, l: -12 },
  },
  {
    // dull
    when: ({ s, l }) => s <= 20 && l <= 90,
    hint: { s: 0, l: 4 },
    interact: { s: 0, l: -4 },
    static: { s: 0, l: -8 },
  },
];

const getStatesBackground = (parts: ColourModes.HSL, modifiers: Modifiers) => {
  const convert = (modifier: Modifier) =>
    chromatism.convert({
      ...parts,
      s: parts.s + modifier.s,
      l: parts.l + modifier.l,
    }).hex;

  return {
    hint: convert(modifiers.hint),
    interact: convert(modifiers.interact),
    static: convert(modifiers.static),
  };
};

export type Colors = {
  background: string;
  text: string;
};

const getContextColors = ({ background, text }: Colors): ContextColors => {
  const bgParts = chromatism.convert(background).hsl;
  const vs = bgParts.l < 30 && bgParts.s < 50 ? -1 : 1;
  const textSubtle = chromatism.brightness(
    1 + vs * 6,
    chromatism.fade(4, background, text).hex[2],
  ).hex;
  const modifiers = colorMatrix.find(cm => cm.when(bgParts)) || {
    hint: { s: 0, l: 8 },
    interact: { s: 0, l: 4 },
    static: { s: 8, l: -6 },
  };

  return {
    background: {
      default: background,
      ...getStatesBackground(bgParts, modifiers),
    },
    text: { default: text, subtle: textSubtle },
  };
};

export const generateMode = (colors: Colors): AppNavigationMode => {
  return {
    primary: getContextColors(colors),
  };
};
