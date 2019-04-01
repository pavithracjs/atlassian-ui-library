import styled from 'styled-components';
import { fontSize, gridSize } from '@atlaskit/theme';

interface Props {
  isCompact?: boolean;
}

const ReadViewContainer = styled.div<Props>`
  display: flex;
  max-width: 100%;
  overflow: hidden;
  padding: 8px 6px;
  font-size: ${fontSize()}px;
  height: ${props =>
    (gridSize() * (props.isCompact ? 1.5 : 2.5)) / fontSize()}em;
  line-height: ${props =>
    (gridSize() * (props.isCompact ? 1.5 : 2.5)) / fontSize()};
`;

ReadViewContainer.displayName = 'ReadViewContainer';

export default ReadViewContainer;
