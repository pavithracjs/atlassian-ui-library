// Each channel is a value 0-255
export interface ColorWithAlpha {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
}

export interface ShapeParameters {
  color: string | number; // Sometime Core set number 255 here. We should ignore this value.
  lineWidth: number;
  addShadow: boolean;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type Tool =
  | 'line'
  | 'blur'
  | 'arrow'
  | 'brush'
  | 'oval'
  | 'rectangle'
  | 'text';

export type TextDirection = 'ltr' | 'rtl';

export interface ExportedImage {
  isExported: boolean; // indicates whether the image export was successful
  content?: string; // base64 image if isExported is true
  error?: string; // failure reason if isExported is false
  dimensions?: Dimensions;
}
