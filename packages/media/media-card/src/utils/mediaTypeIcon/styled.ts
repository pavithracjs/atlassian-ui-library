import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { Y200, P200, B300 } from '@atlaskit/theme/colors';

const typeToColorMap: any = {
  image: Y200,
  audio: P200,
  video: '#ff7143',
  doc: B300,
  unknown: '#3dc7dc',
};

export interface IconWrapperProps {
  type: string;
}

export const IconWrapper: ComponentClass<
  HTMLAttributes<{}> & IconWrapperProps
> = styled.div`
  display: inline-flex;
  color: ${({ type }: IconWrapperProps) =>
    typeToColorMap[type] || typeToColorMap.unknown};
`;
