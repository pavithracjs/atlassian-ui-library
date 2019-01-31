import * as React from 'react';
import styled from 'styled-components';

import { colors } from '@atlaskit/theme';

const Separator = styled.div`
  background: ${colors.N80};
  width: 1px;
  height: 20px;
  margin: 0 8px;
`;

export default () => <Separator className="separator" />;
