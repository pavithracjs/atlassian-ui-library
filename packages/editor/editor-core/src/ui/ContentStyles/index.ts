import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import {
  editorFontSize,
  whitespaceSharedStyles,
  paragraphSharedStyles,
  indentationSharedStyles,
  blockMarksSharedStyles,
  shadowSharedStyle,
} from '@atlaskit/editor-common';
import { telepointerStyle } from '../../plugins/collab-edit/styles';
import { gapCursorStyles } from '../../plugins/gap-cursor/styles';
import { tableStyles } from '../../plugins/table/ui/styles';
import { placeholderStyles } from '../../plugins/placeholder/styles';
import { blocktypeStyles } from '../../plugins/block-type/styles';
import { codeBlockStyles } from '../../plugins/code-block/styles';
import { listsStyles } from '../../plugins/lists/styles';
import { ruleStyles } from '../../plugins/rule/styles';
import { mediaStyles } from '../../plugins/media/styles';
import { layoutStyles } from '../../plugins/layout/styles';
import { panelStyles } from '../../plugins/panel/styles';
import { fakeCursorStyles } from '../../plugins/fake-text-cursor/styles';
import { mentionsStyles } from '../../plugins/mentions/styles';
import { textFormattingStyles } from '../../plugins/text-formatting/styles';
import { placeholderTextStyles } from '../../plugins/placeholder-text/styles';
import { tasksAndDecisionsStyles } from '../../plugins/tasks-and-decisions/ui/styles';
import { gridStyles } from '../../plugins/grid/styles';
import { linkStyles } from '../../plugins/hyperlink/styles';

import {
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  akEditorDeleteBorderBoldSize,
} from '@atlaskit/editor-common';

const ContentStyles: ComponentClass<
  HTMLAttributes<{}> & { theme: any }
> = styled.div`
  /* Hack for ie11 that is being used in code block.
   * https://bitbucket.org/atlassian/atlaskit/src/ad09f6361109ece1aab316c8cbd8116ffb7963ef/packages/editor-core/src/schema/nodes/code-block.ts?fileviewer=file-view-default#code-block.ts-110
   */
  & .ie11 {
    overflow: visible;
    word-wrap: break-word;
  }

  .ProseMirror {
    outline: none;
    font-size: ${editorFontSize}px;

    ${whitespaceSharedStyles};
    ${paragraphSharedStyles};
    ${indentationSharedStyles};
    ${shadowSharedStyle}
  }

  .ProseMirror-hideselection *::selection {
    background: transparent;
  }

  .ProseMirror-hideselection *::-moz-selection {
    background: transparent;
  }

  .ProseMirror-selectednode {
    outline: none;
  }

  .ProseMirror-selectednode:empty {
    outline: 2px solid #8cf;
  }

  .inlineCardView-content-wrap {
    /* cursor disappears left hand side in ff */
    padding-left: 1px;

    max-width: calc(100% - 20px);
    vertical-align: top;
    word-break: break-all;
  }

  .blockCardView-content-wrap {
    display: inline-block;
  }

  /* fix cursor alignment */
  .ProseMirror .emoji-common-node {
    display: inline;
    vertical-align: baseline;

    img {
      display: inline-block;
      vertical-align: middle;
    }
  }

  ${blocktypeStyles}
  ${textFormattingStyles}
  ${placeholderTextStyles}
  ${placeholderStyles}
  ${codeBlockStyles}
  ${listsStyles}
  ${ruleStyles}
  ${mediaStyles}
  ${layoutStyles}
  ${telepointerStyle}
  ${gapCursorStyles};
  ${tableStyles};
  ${panelStyles}
  ${fakeCursorStyles}
  ${mentionsStyles}
  ${tasksAndDecisionsStyles}
  ${gridStyles}
  ${linkStyles}
  ${blockMarksSharedStyles}

  /** Global selector for extensions, as .danger tag is assigned to root level node which is unaccessible from triggered child node **/
  /* Danger when nested node */
  .danger .extension-container {
    background: rgb(255, 189, 173, 0.5); /* R75 with 50% opactiy */
    transition: opacity 0s;
  }

  /* Danger when top level node */
  .danger > span > .extension-container {
    background: ${akEditorDeleteBackground};
    .extension-overlay {
      box-shadow: inset 0px 0px 0px ${akEditorDeleteBorderBoldSize}px ${akEditorDeleteBorder} !important;
      opacity: 1;
      transition: opacity 0s;
    }
  }

  .panelView-content-wrap {
    box-sizing: border-box;
  }

  .mediaGroupView-content-wrap ul {
    padding: 0;
  }

  /** Needed to override any cleared floats, e.g. image wrapping */
  div.fabric-editor-block-mark[class^='fabric-editor-align'] {
    clear: none !important;
  }

  .fabric-editor-align-end {
    text-align: right;
  }

  .fabric-editor-align-start {
    text-align: left;
  }

  .fabric-editor-align-center {
    text-align: center;
  }

  .hyperlink-floating-toolbar {
    padding: 0;
  }

`;

export default ContentStyles;
