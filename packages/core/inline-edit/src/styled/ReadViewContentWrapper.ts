import styled from 'styled-components';
import { colors } from '@atlaskit/theme';

interface Props {
  readViewFitContainerWidth?: boolean;
}

const ReadViewContentWrapper = styled.div<Props>`
  display: inline-block;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border: 2px solid transparent;
  border-radius: 3px;
  &:hover {
    background: ${colors.N30};
  }
  width: ${({ readViewFitContainerWidth }) =>
    readViewFitContainerWidth ? '100%' : 'auto'};
`;

ReadViewContentWrapper.displayName = 'ReadViewContentWrapper';

export default ReadViewContentWrapper;
