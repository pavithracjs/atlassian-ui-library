import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { headingsSharedStyles } from '@atlaskit/editor-common';

export const BlockTypeMenuItem: ComponentClass<
  HTMLAttributes<{}> & {
    tagName: string;
    selected?: boolean;
  }
> = styled.div`
  ${headingsSharedStyles};
  > h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
  }
  ${props => (props.selected ? `${props.tagName} { color: white }` : '')};
`;
