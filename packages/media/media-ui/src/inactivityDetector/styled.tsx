import styled from 'styled-components';
import { hideControlsClassName } from '..';

export interface ContentWrapperProps {
  showControls: boolean;
}

const handleControlsVisibility = ({ showControls }: ContentWrapperProps) => `
  transition: opacity .3s;
  opacity: ${showControls ? '1' : '0'};
`;

export const InactivityDetectorWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
  align-items: center;
  justify-content: center;

  .${hideControlsClassName} {
    ${handleControlsVisibility};
  }
`;

InactivityDetectorWrapper.displayName = 'InactivityDetectorWrapper';
