import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { fontFamily } from '@atlaskit/theme/constants';
import { N30 } from '@atlaskit/theme/colors';

export const MediaPickerPopupWrapper = styled.div`
  display: flex;
  cursor: default;
  user-select: none;
  font-family: ${fontFamily()};
  border-radius: 3px;
  position: relative;

  /* Ensure that the modal has a static size */
  width: 968px;
`;

export const SidebarWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 235px;
  min-width: 235px;
  background-color: ${N30};
`;

export const ViewWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  /* Height of the Popup should never change */
  height: calc(100vh - 200px);

  background-color: white;
`;
