import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';

// TODO: remove this override behaviour for @atlaskit/icon-object
export const IconObjectOverrides = `
  & > span {
    height: 100%;
    width: 14px;
    & > svg {
      vertical-align: top;
    }
  }
`;
// TODO: remove this override behaviour for @atlaskit/icon
export const IconOverrides = `
  & > span > span {
    height: 100%;
    width: 14px;
    & > svg {
      vertical-align: top;
    }
  }
`;

// Wraps all icons represented in Inline Links. Icons have three sources/types:
// - JSON-LD: from the generator.icon property coming back from ORS.
// - @atlaskit/icon: for lock icons, unauthorized, etc.
// - @atlaskit/icon-object: for object icons, e.g. repository, branch, etc.
// NB: the first set of overrides style icons imported from @atlaskit/icon-object correctly.
// NB: the second set of overrides style icons imported from @atlaskit/icon correctly.
export const IconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  margin-right: 4px;
  user-select: none;
  ${IconOverrides}
  ${IconObjectOverrides}
`;

// The main 'wrapping' element, title of the content.
// NB: `white-space` adds little whitespace before wrapping.
// NB: `hyphens` enables hyphenation on word break.
export const IconTitleWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  hyphens: auto;
`;

export const IconTitleHeadNoBreakWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.span`
  white-space: nowrap;
  overflow-wrap: break-word;
  min-width: 8ch;
`;

// TODO: Replace overrides with proper AtlasKit solution.
export const LozengeWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: inline-block;
  vertical-align: text-bottom;
  & > span {
    margin-left: 4px;
    padding: 2px 0 1px 0;
  }
`;
