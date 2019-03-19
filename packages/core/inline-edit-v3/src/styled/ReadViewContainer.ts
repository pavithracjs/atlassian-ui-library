import styled from 'styled-components';
import { gridSize, fontSize } from '@atlaskit/theme';

const ReadViewContainer = styled.div`
  display: flex;
  max-width: 100%;
  overflow: hidden;
  padding: 8px 6px;
  font-size: ${fontSize()}px;
  height: ${(gridSize() * 2.5) / fontSize()}em;
  line-height: ${(gridSize() * 2.5) / fontSize()};
`;

ReadViewContainer.displayName = 'ReadViewContainer';

export default ReadViewContainer;
