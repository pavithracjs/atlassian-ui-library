/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  containerStyles,
  customProductIconStyles,
  customProductLogoStyles,
  productIconStyles,
  productLogoStyles,
} from './styles';
import {
  CustomProductHomeProps,
  ProductHomeComponentProps,
  ProductHomeProps,
} from './types';

const defaultCustomComponent = (props: ProductHomeComponentProps) => (
  <div {...props} />
);

export const ProductHome = ({
  component: Component = defaultCustomComponent,
  icon: Icon,
  logo: Logo,
}: ProductHomeProps) => (
  <Component css={containerStyles}>
    <div css={productLogoStyles}>
      <Logo />
    </div>
    <div css={productIconStyles}>
      <Icon size="small" />
    </div>
  </Component>
);

export const CustomProductHome = (props: CustomProductHomeProps) => {
  const {
    component: Component = defaultCustomComponent,
    iconAlt,
    iconUrl,
    logoAlt,
    logoUrl,
  } = props;

  return (
    <Component css={containerStyles}>
      <img css={customProductLogoStyles} src={logoUrl} alt={logoAlt} />
      <img css={customProductIconStyles} src={iconUrl} alt={iconAlt} />
    </Component>
  );
};
