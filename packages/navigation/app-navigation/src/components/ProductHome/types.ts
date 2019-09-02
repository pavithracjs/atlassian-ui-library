import { SerializedStyles } from '@emotion/core';
import { ComponentType, ReactNode } from 'react';

export type ProductHomeComponentProps = {
  children: ReactNode;
  css: SerializedStyles;
};

export type ProductHomeProps = {
  component?: ComponentType<ProductHomeComponentProps>;
  /** The product icon. Expected to be an Icon from the Atlaskit Logo package. Visible on smaller screen sizes */
  icon: ComponentType<{
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | undefined;
  }>;
  /** The product logo, visible on larger screen sizes */
  logo: ComponentType<{}>;
};

export type CustomProductHomeProps = {
  component?: ComponentType<ProductHomeComponentProps>;
  iconAlt: string;
  iconUrl: string;
  logoAlt: string;
  logoUrl: string;
};
