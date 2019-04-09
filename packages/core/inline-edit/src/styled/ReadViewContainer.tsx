import styled from 'styled-components';
import { fontSize, gridSize } from '@atlaskit/theme';

interface Props {
  isCompact?: boolean;
}

const ReadViewContainer = styled.div<Props>`
  display: flex;
  max-width: 100%;
  overflow: hidden;
  padding: ${props => (props.isCompact ? gridSize() / 2 : gridSize())}px
    ${gridSize() - 2}px;
  font-size: ${fontSize()}px;
  height: ${(gridSize() * 2.5) / fontSize()}em;
  line-height: ${(gridSize() * 2.5) / fontSize()};
`;

ReadViewContainer.displayName = 'ReadViewContainer';

export default ReadViewContainer;
