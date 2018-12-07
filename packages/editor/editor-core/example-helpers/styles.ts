import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';

import { colors, gridSize, themed } from '@atlaskit/theme';

// tslint:disable-next-line:variable-name
export const Content: ComponentClass<HTMLAttributes<{}>> = styled.div`
  & div.toolsDrawer {
    margin-top: 16px;
    padding: 8px 16px;
    background: ${colors.N800};

    & label {
      display: flex;
      color: white;
      align-self: center;
      padding-right: 8px;
    }

    & button {
      margin: 4px 0;
    }
  }

  & legend {
    margin: 8px 0;
  }

  & input {
    font-size: 13px;
  }
`;

// tslint:disable-next-line:variable-name
export const ButtonGroup: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;

  & > button {
    margin-left: ${gridSize() / 2}px;
  }
`;

export const TitleInput: any = styled.input`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;
  background-color: inherit;
  color: ${themed({ light: 'black', dark: colors.DN900 })};

  &::placeholder {
    color: ${colors.N90};
  }
`;
