import { css } from 'styled-components';
import { borderRadius } from '@atlaskit/theme';
import {
  akEditorSelectedBorder,
  akEditorSelectedBorderBoldSize,
} from '@atlaskit/editor-common';

export const extensionStyles = css`
  .extensionView-content-wrap.ProseMirror-selectednode,
  .bodiedExtensionView-content-wrap.ProseMirror-selectednode {
    box-shadow: 0 0 0 ${akEditorSelectedBorderBoldSize}px
      ${akEditorSelectedBorder};
    border-radius: ${borderRadius}px;
  }
`;
