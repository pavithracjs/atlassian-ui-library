/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import SuccessContainer from './SuccessContainer';
import { fontSize, gridSize } from '@atlaskit/theme';

export default () => (
  <SuccessContainer>
    <h1
      css={css`
        font-size: ${fontSize()}px;
        font-weight: 600;
        margin-top: 0;
        line-height: ${gridSize() * 3}px;
      `}
    >
      Thanks for your feedback
    </h1>
  </SuccessContainer>
);
