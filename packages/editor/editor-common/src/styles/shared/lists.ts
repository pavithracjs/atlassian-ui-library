import { css } from 'styled-components';

export const listsSharedStyles = css`
  /* =============== INDENTATION SPACING ========= */

  ul,
  ol {
    box-sizing: border-box;
    padding-left: 24px;
  }

  /* =============== INDENTATION AESTHETICS ========= */

  /**
        We support nested lists up to six levels deep.
    **/

  ul,
  ul ul ul ul {
    list-style-type: disc;
  }

  ul ul,
  ul ul ul ul ul {
    list-style-type: circle;
  }

  ul ul ul,
  ul ul ul ul ul ul {
    list-style-type: square;
  }

  ol,
  ol ol ol ol {
    list-style-type: decimal;
  }
  ol ol,
  ol ol ol ol ol {
    list-style-type: lower-alpha;
  }
  ol ol ol,
  ol ol ol ol ol ol {
    list-style-type: lower-roman;
  }
`;
