// @flow
/** @jsx jsx */

import { jsx } from '@emotion/core';
import CloseIcon from '@atlaskit/icon/glyph/editor/close';
import { borderRadius, colors } from '@atlaskit/theme';

const hiddenStyles = {
  background: 0,
  backgroundClip: '-1px -1px -1px -1px',
  border: 0,
  height: 1,
  opacity: 0,
  padding: 0,
  position: 'absolute',
  width: 1,
};

export const Note = (props: *) => (
  <div
    css={{
      color: colors.N200,
      fontSize: '0.75rem',
      marginTop: '0.5em',
    }}
    {...props}
  />
);

export const HiddenButton = (props: *) => (
  <button css={hiddenStyles} {...props} />
);

export const HiddenLabel = (props: *) => (
  <label css={hiddenStyles} {...props} />
);

export const ClearButton = ({ label, isSelected, ...props }: *) => {
  const size = 24;

  return (
    <button
      css={{
        background: 0,
        border: 0,
        borderRadius: borderRadius() / 2,
        color: isSelected ? 'white' : colors.N400,
        cursor: 'pointer',
        height: size,
        lineHeight: 1,
        opacity: 0.66,
        outline: 0,
        padding: 0,
        position: 'absolute',
        right: 8,
        top: '50%',
        marginTop: -(size / 2),
        transition: 'background-color 200ms, opacity 200ms',
        width: size,

        ':hover, :focus': {
          backgroundColor: isSelected ? colors.N400A : colors.N30A,
          opacity: 1,
        },
      }}
      {...props}
    >
      <CloseIcon primaryColor="inherit" label={label} />
    </button>
  );
};
ClearButton.defaultProps = {
  isSelected: false,
  type: 'button',
};
