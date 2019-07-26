import React from 'react';
import * as colors from '@atlaskit/theme/colors';
import PackagesIcon from '@atlaskit/icon/glyph/component';
import DocumentationIcon from '@atlaskit/icon/glyph/overview';
import PatternsIcon from '@atlaskit/icon/glyph/issues';

export type IconProps = { label: string; primaryColor: string };

export type HeaderIconProps = {
  icon: React.ComponentType<IconProps>;
  color: string;
  label: string;
};

export const CONTAINER_HEADERS_CONFIG: { [key: string]: HeaderIconProps } = {
  docs: {
    icon: DocumentationIcon as React.ComponentType<IconProps>,
    color: colors.P300,
    label: 'Documentation',
  },
  packages: {
    icon: PackagesIcon as React.ComponentType<IconProps>,
    color: colors.R300,
    label: 'Packages',
  },
  patterns: {
    icon: PatternsIcon as React.ComponentType<IconProps>,
    color: colors.G300,
    label: 'Patterns',
  },
};
