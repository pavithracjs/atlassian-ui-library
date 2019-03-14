import styled from 'styled-components';

interface ReadViewContainerProps {
  isInvalid: boolean;
}

const ReadViewContainer = styled.div<ReadViewContainerProps>`
  max-width: 100%;
  overflow: hidden;
  padding: 11px 6px;
  line-height: 1;
  display: flex;
  border: ${props =>
    props.isInvalid ? '2px solid red' : '2px solid transparent'}
  font-size: 14px;
`;

ReadViewContainer.displayName = 'ReadViewContainer';

export default ReadViewContainer;
