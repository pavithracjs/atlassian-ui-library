import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { B200 } from '@atlaskit/theme/colors';
import { borderRadius, size } from '../../mixins';

export const IconBackground: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ${borderRadius}
  ${size(24)}
  background-color: ${B200};
`;
