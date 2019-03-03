// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass, InterpolationFunction, ThemeProps } from 'styled-components';
import { gridSize, borderRadius } from '@atlaskit/theme';
import {
  relativeSize,
  akEditorTableCellMinWidth,
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  akEditorDeleteIconColor,
} from '../consts';

export const PanelSharedCssClassName = {
  PANEL_CONTAINER: 'ak-editor-panel',
};

export const panelSharedStyles = css`
  & .${PanelSharedCssClassName.PANEL_CONTAINER} {
    border-radius: ${borderRadius()}px;
    margin: ${relativeSize(1.142)}px 0;
    padding: ${gridSize()}px;
    min-width: ${akEditorTableCellMinWidth}px;
    display: flex;
    align-items: baseline;
    word-break: break-word;
    border: 1px solid transparent;

    .ak-editor-panel__icon {
      display: block;
      flex-shrink: 0;
      height: ${gridSize() * 3}px;
      width: ${gridSize() * 3}px;
      box-sizing: content-box;
      padding-right: ${gridSize()}px;

      > span {
        vertical-align: middle;
        display: inline;
      }
    }

    .ak-editor-panel__content {
      margin: 1px 0 1px;
      flex: 1 0 0;
    }
  }

  & .danger .${PanelSharedCssClassName.PANEL_CONTAINER} {
    background: ${akEditorDeleteBackground} !important;
    border-color: ${akEditorDeleteBorder};

    .ak-editor-panel__icon {
      color: ${akEditorDeleteIconColor} !important;
    }
  }
`;
