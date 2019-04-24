// eslint-disable-next-line import/prefer-default-export
export const WIDTH_ENUM: WidthEnumType = {
  values: ['small', 'medium', 'large', 'x-large'],
  widths: {
    small: 400,
    medium: 600,
    large: 800,
    'x-large': 968,
  },
  defaultValue: 'medium',
};

export type WidthEnumType = {
  values: string[];
  widths: { small: number; medium: number; large: number; 'x-large': number };
  defaultValue: string;
};

export type widthNames = 'small' | 'medium' | 'large' | 'x-large';

export const gutter = 60;
