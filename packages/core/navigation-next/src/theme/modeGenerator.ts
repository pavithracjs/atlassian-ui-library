// TODO: @atlassian/navigation package is the only other package that uses chromatism (currently).
// We should update to chromatism@3.0.0 once @atlassian/navigation package is deprecated.
import chromatism, { ColourModes } from 'chromatism';

import globalItemStyles from '../components/presentational/GlobalItem/styles';
import globalNavStyles from '../components/presentational/GlobalNav/styles';
import contentNavStyles from '../components/presentational/ContentNavigation/styles';
import itemStyles from '../components/presentational/Item/styles';
import headingStyles from '../components/presentational/GroupHeading/styles';
import separatorStyles from '../components/presentational/Separator/styles';
import sectionStyles from '../components/presentational/Section/styles';
import skeletonItemStyles from '../components/presentational/SkeletonItem/styles';

import { Mode, ContextColors } from './ts-types';
import HSL = ColourModes.HSL;
import HEX = ColourModes.HEX;

type Product = {
  background: string;
  text: string;
};

type Args = {
  product: Product;
};

type Entry = { s: number; l: number };

interface ColorMatrixItem {
  when: (entry: Entry) => boolean;
  hint: Entry;
  interact: Entry;
  static: Entry;
}

const colorMatrix: ColorMatrixItem[] = [
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

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type ColorMatrixItemWithoutWhen = Omit<ColorMatrixItem, 'when'>;

const options: Array<keyof ColorMatrixItemWithoutWhen> = [
  'hint',
  'interact',
  'static',
];

const getStatesBackground = (
  parts: HSL,
  modifier: ColorMatrixItemWithoutWhen,
) =>
  options.reduce(
    (acc, k) => {
      acc[k] = chromatism.convert({
        ...parts,
        s: parts.s + modifier[k].s,
        l: parts.l + modifier[k].l,
      }).hex;
      return acc;
    },
    {} as { [key: string]: HEX },
  );

const getContextColors = ({ background, text }: Product): ContextColors => {
  const bgParts = chromatism.convert(background).hsl;
  const vs = bgParts.l < 30 && bgParts.s < 50 ? -1 : 1;
  const textSubtle = chromatism.brightness(
    1 + vs * 6,
    chromatism.fade(4, background, text).hex[2],
  ).hex;
  const colorMod = colorMatrix.find(cm => cm.when(bgParts)) || {
    hint: { s: 0, l: 8 },
    interact: { s: 0, l: 4 },
    static: { s: 8, l: -6 },
  };

  return {
    background: {
      default: background,
      ...(getStatesBackground(bgParts, colorMod) as {
        hint: string;
        interact: string;
        static: string;
      }),
    },
    text: { default: text, subtle: textSubtle },
  };
};

export default ({ product }: Args): Mode => {
  const modeColors = {
    product: getContextColors(product),
  };

  return {
    globalItem: globalItemStyles(modeColors),
    globalNav: globalNavStyles(modeColors),
    contentNav: contentNavStyles(modeColors),
    heading: headingStyles(modeColors),
    item: itemStyles(modeColors),
    section: sectionStyles(modeColors),
    separator: separatorStyles(modeColors),
    skeletonItem: skeletonItemStyles(modeColors),
  };
};
