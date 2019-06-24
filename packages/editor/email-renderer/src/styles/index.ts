import { styles as paragraphStyles } from '../nodes/paragraph';
import { styles as codeBlockStyles } from '../nodes/code-block';
import { styles as headingStyles } from '../nodes/heading';
import { styles as listItemStyles } from '../nodes/list-item';
import { styles as bulletListStyles } from '../nodes/bullet-list';
import { styles as orderedListStyles } from '../nodes/ordered-list';
import { styles as blockquoteStyles } from '../nodes/blockquote';
import { styles as ruleStyles } from '../nodes/rule';
import { styles as mentionStyles } from '../nodes/mention';
import { styles as tableCellStyles } from '../nodes/table-cell';
import { styles as tableRowStyles } from '../nodes/table-row';
import { styles as tableHeaderStyles } from '../nodes/table-header';
import { styles as statusStyles } from '../nodes/status';
import { styles as alignmentStyles } from '../marks/alignment';
import { styles as codeStyles } from '../marks/code';
import { styles as emStyles } from '../marks/em';
import { styles as indentationStyles } from '../marks/indentation';
import { styles as linkStyles } from '../marks/link';
import { styles as strikeStyles } from '../marks/strike';
import { styles as strongStyles } from '../marks/strong';
import { styles as underlineStyles } from '../marks/underline';
import { fontFamily, fontSize, fontWeight, lineHeight } from './common';
import { createClassName } from './util';

const styles = `
  .${createClassName('wrapper')} {
    font-family: ${fontFamily};
    font-size: ${fontSize};
    font-weight: ${fontWeight};
    line-height: ${lineHeight};
    vertical-align: baseline;
  }
  .${createClassName('table')} {
    font-family: ${fontFamily};
    font-size: ${fontSize};
    font-weight: ${fontWeight};
    line-height: ${lineHeight};
  }
  .${createClassName('table')} td > :first-child,
  .${createClassName('table')} th > :first-child {
    padding-top: 0px;
  }
  .${createClassName('table')} td > :last-child,
  .${createClassName('table')} th > :last-child {
    margin-bottom: 0px;
  }
  ${paragraphStyles}
  ${codeBlockStyles}
  ${headingStyles}
  ${blockquoteStyles}
  ${bulletListStyles}
  ${orderedListStyles}
  ${listItemStyles}
  ${ruleStyles}
  ${mentionStyles}
  ${statusStyles}
  ${tableHeaderStyles}
  ${tableCellStyles}
  ${tableRowStyles}

  ${alignmentStyles}
  ${codeStyles}
  ${emStyles}
  ${indentationStyles}
  ${linkStyles}
  ${strikeStyles}
  ${strongStyles}
  ${underlineStyles}
`;
export default styles;
