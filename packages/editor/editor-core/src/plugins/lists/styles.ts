// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';

export const listsStyles = css`
  .ProseMirror li {
    position: relative;
    /* Dont do weird stuff with marker clicks */
    pointer-events: none;

    > p:not(:first-child) {
      margin: 4px 0 0 0;
    }
  }

  .ProseMirror li {
    > {
      * {
        /* Restore pointer events. */
        pointer-events: auto;
      }
      p {
        /* Support clicking adjacent floated content */
        pointer-events: inherit;
      }
    }
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
`;
