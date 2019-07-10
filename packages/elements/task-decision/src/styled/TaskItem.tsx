import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { gridSize, colors, themed } from '@atlaskit/theme';

const checkedBoxSvg = (color: string) =>
  `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="12" height="12" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect width="12" height="12" rx="2" fill="${color}"></rect>
  <path fill="#FFFFFF" d="M9.374 4.914L5.456 8.832a.769.769 0 0 1-1.088 0L2.626 7.091a.769.769 0 1 1 1.088-1.089L4.912 7.2l3.374-3.374a.769.769 0 1 1 1.088 1.088"></path>
</svg>`;

const checkedBoxDataUrl = (color: string) =>
  `url(data:image/svg+xml;charset=utf-8;base64,${btoa(checkedBoxSvg(color))})`;

export const CheckBoxWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  position: relative;
  align-self: start;
  margin: 2px ${gridSize()}px 0 0;

  & > input[type='checkbox'] {
    position: absolute;
    outline: none;
    margin: 0;
    opacity: 0;
    left: 0;
    top: 50%;
    transform: translateY(-50%);

    + label {
      box-sizing: border-box;
      display: block;
      position: relative;
      width: 100%;
      cursor: pointer;

      &::after {
        background: ${themed({ light: colors.N10, dark: colors.DN80 })}
        background-size: 16px;
        border-radius: 3px;
        border-style: solid;
        border-width: 2px;
        border-color: ${themed({ light: colors.N40, dark: colors.DN90 })}
        box-sizing: border-box;
        content: '';
        height: 16px;
        left: 50%;
        position: absolute;
        transition: border-color 0.2s ease-in-out;
        top: 8px;
        width: 16px;
        transform: translate(-50%, -50%);
      }
    }
    &:not([disabled]) + label:hover::after {
      background: ${themed({ light: colors.N30, dark: colors.B75 })}
      transition: border 0.2s ease-in-out;
    }
    &[disabled] + label {
      opacity: 0.5;
      cursor: default;
    }
    &:checked {
      + label::after {
        background: ${checkedBoxDataUrl(colors.B400)} no-repeat 0 0;
        background-size: 16px;
        border: 0;
        border-color: transparent;
        border-radius: 0; /* FS-1392 */
      }
      &:not([disabled]) + label:hover::after {
        background: ${checkedBoxDataUrl(colors.B300)} no-repeat 0 0;
        background-size: 16px;
      }
    }
  }
`;
