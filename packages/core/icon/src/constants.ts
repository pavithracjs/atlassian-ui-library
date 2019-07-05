export type sizeOptions = 'small' | 'medium' | 'large' | 'xlarge';

export const sizes: Record<sizeOptions, string> = {
  small: '16px',
  medium: '24px',
  large: '32px',
  xlarge: '48px',
};

export const sizeMap: Record<string, sizeOptions> = {
  small: 'small',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
};
