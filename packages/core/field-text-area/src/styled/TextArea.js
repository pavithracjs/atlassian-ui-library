// @flow
import styled, { css } from 'styled-components';
import { colors, fontSize } from '@atlaskit/theme';

const getPlaceholderStyle = style => css`
  &::-webkit-input-placeholder {
    /* WebKit, Blink, Edge */
    ${style};
  }
  &::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    ${style} opacity: 1;
  }
  &::-ms-input-placeholder {
    /* Microsoft Edge */
    ${style};
  }
  &:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    ${style} opacity: 1;
  }
  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    ${style};
  }
`;
const getPlaceholderColor = css`
  color: ${colors.placeholderText};
`;

// Safari puts on some difficult to remove styles, mainly for disabled inputs
// but we want full control so need to override them in all cases
const overrideSafariDisabledStyles = `
  -webkit-text-fill-color: unset;
  -webkit-opacity: 1;
`;

const TextArea = styled.textarea`
  background: transparent;
  padding: 0;
  margin: 0;
  border: 0;
  box-sizing: border-box;
  color: inherit;
  cursor: inherit;
  font-family: inherit;
  font-size: ${fontSize}px;
  line-height: ${20 / fontSize()};
  outline: none;
  width: 100%;

  [disabled] {
    ${overrideSafariDisabledStyles};
  }

  ${({ minimumRows }) =>
    css`
      min-height: ${20 * minimumRows}px;
    `} ${({ enableResize }) =>
      enableResize
        ? ''
        : css`
            resize: none;
          `} &::-ms-clear {
    display: none;
  }

  &:invalid {
    box-shadow: none;
  }
  ${getPlaceholderStyle(getPlaceholderColor)};
`;

export default TextArea;
