import * as React from 'react';
import Inline from './inline';
import styled from 'styled-components';
import CopyIcon from '@atlaskit/icon/glyph/copy';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const CopyAnchor = styled.a`
  color: red;
  position: absolute;
  transform: translateX(-24px);
  border-radius: 50%;
  background-color: blue;
  height: 25px;
  width: 25px;
`;

export default function Heading(
  props: {
    level: HeadingLevel;
    headingId?: string;
  } & React.Props<any>,
) {
  const { level, children, headingId } = props;
  const HX = `h${level}`;

  return (
    <HX id={headingId}>
      <CopyAnchor
        className="copy-anchor"
        href={`#` + encodeURIComponent(headingId)}
      >
        <CopyIcon />
      </CopyAnchor>
      <Inline>{children}</Inline>
    </HX>
  );
}
