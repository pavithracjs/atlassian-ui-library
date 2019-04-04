/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';

export type Props = {
  onClick?: React.MouseEventHandler;
  fit: boolean;
};

const ButtonWrapper: React.StatelessComponent<Props> = props => {
  const styles = {
    alignSelf: 'center',
    display: 'inline-flex',
    flexWrap: 'nowrap',
    maxWidth: '100%',
    position: 'relative',
    ...(props.fit && { width: '100%' }),
    ...(props.fit && { justifyContent: 'center' }),
  };

  const optionalProps: Pick<Props, 'onClick'> = {};
  if (props.onClick) {
    optionalProps.onClick = props.onClick;
  }
  return (
    <span css={styles} {...optionalProps}>
      {props.children}
    </span>
  );
};

export default ButtonWrapper;
