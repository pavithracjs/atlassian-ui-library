import * as React from 'react';
import styled from 'styled-components';
import Theme, { ThemeTokens } from '../theme';

const ReadViewContainer = styled.div<ThemeTokens>`
  display: flex;
  max-width: 100%;
  overflow: hidden;
  padding: 8px 6px;
  font-size: ${theme => theme.fontSize}px;
  height: ${theme => (theme.gridSize * 2.5) / theme.fontSize}em;
  line-height: ${theme => (theme.gridSize * 2.5) / theme.fontSize};
`;

ReadViewContainer.displayName = 'ReadViewContainer';

export default (
  <Theme.Consumer>
    {(tokens: ThemeTokens) => <ReadViewContainer {...tokens} />}
  </Theme.Consumer>
);
