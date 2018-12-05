import { css } from 'styled-components';
import { borderRadius, colors, fontFamily } from '@atlaskit/theme';
import {
  blockNodesVerticalMargin,
  akEditorTableCellMinWidth,
} from '@atlaskit/editor-common';
import { akEditorCodeFontFamily, akEditorCodeBlockPadding } from '../../styles';

export const codeBlockStyles = css`
  .ProseMirror .code-block {
    position: relative;
    font-family: ${akEditorCodeFontFamily};
    background: ${colors.N20};
    border-radius: ${borderRadius()}px;
    font-size: 14px;
    line-height: 24px;
    margin: ${blockNodesVerticalMargin} 0 0 0;
    counter-reset: line;
    display: flex;
    min-width: ${akEditorTableCellMinWidth}px;

    .line-number-gutter {
      color: ${colors.N300};
      background-color: rgba(9, 30, 66, 0.04);
      text-align: right;
      user-select: none;
      padding: ${akEditorCodeBlockPadding} 8px;
      border-radius: ${borderRadius()}px;
      font-size: 12px;
      line-height: 24px;

      span {
        display: block;

        &::before {
          counter-increment: line;
          content: counter(line);
          display: inline-block;
        }
      }
    }

    .code-content {
      padding: ${akEditorCodeBlockPadding} 16px;
      color: ${colors.N800};
      overflow: auto;
      display: flex;
      flex: 1;

      pre {
        width: 100%;
      }
      code {
        display: inline-block;
        min-width: 100%;
        tab-size: 4;
      }
    }

    .code-language-picker-trigger {
      position: absolute;
      opacity: 0;
      font-size: 12px;
      font-family: ${fontFamily()};
      transition: opacity 0.2s cubic-bezier(0.19, 1, 0.22, 1),
        background-color 0.2s cubic-bezier(0.19, 1, 0.22, 1);
      padding: 0 9px;
      border-radius: ${borderRadius()}px;
      top: 12px;
      right: 16px;
      color: ${colors.N300};
      background-color: ${colors.N30};

      &:hover {
        background-color: ${colors.N40};
      }
    }

    .code-language-picker {
      position: absolute;
      opacity: 0;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 100%;
      z-index: 1;
      pointer-events: all;

      &:hover {
        cursor: pointer;
      }
    }

    &:hover {
      .code-language-picker-trigger {
        opacity: 1;
      }
    }

    /* We render this as a basic box in IE11 because it can't handle scrolling */
    &.ie11 {
      display: block;
      .line-number-gutter {
        display: none;
      }
      .code-content {
        display: block;
        overflow: visible;

        pre {
          width: auto;
        }
        code {
          display: inline;
        }
      }
    }
  }
  .ProseMirror li > .code-block {
    margin: 0;
  }
`;
