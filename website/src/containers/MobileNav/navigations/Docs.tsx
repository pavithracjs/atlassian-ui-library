import React from 'react';
import PageIcon from '@atlaskit/icon/glyph/page';
import { Directory } from '../../../types';
import renderNav from '../utils/renderNav';
import buildNavGroups from '../utils/buildNavGroups';

export type DocsNavProps = {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  pathname: string;
  docs: Directory;
};

export default function docsNav({ pathname, docs, onClick }: DocsNavProps) {
  const groups = buildNavGroups('docs', PageIcon, pathname, docs);
  return [renderNav(groups, { pathname, onClick })];
}
