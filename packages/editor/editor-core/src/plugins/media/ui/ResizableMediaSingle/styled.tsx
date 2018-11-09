import * as React from 'react';
import styled from 'styled-components';
import {
  MediaSingleDimensionHelper,
  MediaSingleDimensionHelperProps,
} from '@atlaskit/editor-common';

export const Wrapper: React.ComponentClass<
  React.HTMLAttributes<{}> & MediaSingleDimensionHelperProps
> = styled.div`
  & > div {
    ${MediaSingleDimensionHelper};
    position: relative;

    > div {
      position: absolute;
      height: 100%;
    }
  }

  & > div::after {
    content: '';
    display: block;
    padding-bottom: ${p => (p.height / p.width) * 100}%;
  }
`;
