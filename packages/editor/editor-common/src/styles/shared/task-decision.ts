// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { fontSize } from '@atlaskit/theme';
import { akEditorTableCellMinWidth } from '../';

export const tasksAndDecisionsStyles = css`
  .ProseMirror .taskItemView-content-wrap,
  .ProseMirror .decisionItemView-content-wrap {
    font-size: ${fontSize()}px;
    min-width: ${akEditorTableCellMinWidth}px;
  }

  div[data-task-list-local-id] div[data-task-list-local-id] {
    margin-left: 24px;
  }
`;
