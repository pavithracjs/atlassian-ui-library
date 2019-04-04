/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { gridSize } from '@atlaskit/theme';
import { getLoadingStyle } from './utils';

type Props = {
  followsIcon: boolean;
  spacing: string;
  isLoading?: boolean;
};

const getAlignment = (p: Props) => (p.followsIcon ? 'baseline' : 'center');
const getMargin = ({ spacing = 'default' }: Props) =>
  spacing === 'none' ? 0 : `0 ${gridSize() / 2}px`;

const ButtonContent: React.StatelessComponent<Props> = props => {
  const styles = {
    alignItems: getAlignment(props),
    alignSelf: getAlignment(props),
    flex: '1 1 auto',
    margin: getMargin(props),
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    ...getLoadingStyle(props),
  };
  return <span css={styles}>{props.children}</span>;
};

export default ButtonContent;
