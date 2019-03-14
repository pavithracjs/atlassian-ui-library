// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';

export const listsStyles = css`
  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 30px;
    box-sizing: border-box;
  }

  .ProseMirror ul ul,
  .ProseMirror ul ol,
  .ProseMirror ol ul,
  .ProseMirror ol ol {
    padding-left: 21px;
  }

  .ProseMirror li {
    position: relative;
    /* Dont do weird stuff with marker clicks */
    pointer-events: none;

    > p:not(:first-child) {
      margin: 4px 0 0 0;
    }
  }

  .ProseMirror li > * {
    /*
    Restore pointer events. We use inherit instead of auto to ensure adjacent floated
    content remains clickable.
    */
    pointer-events: inherit;
    background: rgba(123, 45, 67, 0.2);
  }
  /* Make sure li selections wrap around markers */
  li.ProseMirror-selectednode {
    outline: none;
  }

  li.ProseMirror-selectednode::after {
    content: '';
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }

  /** =============== LIST INDENT STYLES ========= */

  /*
    Rules using the layout attribute, or the gapcursor selector ensure the indentation
    is applied even if the ProseMirror injected ZWSP character cursor span is adjacent.
    It gets injected in different locations depending on the floated media's position
    so we cover several situations.
  */
  [layout='wrap-left'] + .ProseMirror-gapcursor + span {
    + ul,
    + ol {
      overflow: hidden;
      padding-left: 24px;
    }
  }
  [layout='wrap-right'] + .ProseMirror-gapcursor + span {
    + ul,
    + ol {
      overflow: hidden;
    }
  }
  .ProseMirror-gapcursor {
    + [layout='wrap-left'] + span {
      + ul,
      + ol {
        overflow: hidden;
        padding-left: 24px;
      }
    }
    + [layout='wrap-right'] + span {
      + ul,
      + ol {
        overflow: hidden;
      }
    }
  }
  .ProseMirror {
    [layout='wrap-left'] {
      + ul,
      + ol {
        overflow: hidden;
        padding-left: 24px;
      }
    }
    [layout='wrap-right'] {
      + ul,
      + ol {
        overflow: hidden;
      }
    }

    ul,
    ul ul ul ul,
    ul ul ul ul ul ul ul {
      list-style-type: disc;
    }

    ul ul,
    ul ul ul ul ul,
    ul ul ul ul ul ul ul ul {
      list-style-type: circle;
    }

    ul ul ul,
    ul ul ul ul ul ul,
    ul ul ul ul ul ul ul ul ul {
      list-style-type: square;
    }

    ol,
    ol ol ol ol,
    ol ol ol ol ol ol ol {
      list-style-type: decimal;
    }
    ol ol,
    ol ol ol ol ol,
    ol ol ol ol ol ol ol ol {
      list-style-type: lower-alpha;
    }
    ol ol ol,
    ol ol ol ol ol ol,
    ol ol ol ol ol ol ol ol ol {
      list-style-type: lower-roman;
    }
  }
`;
