/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import SuccessContainer from './SuccessContainer';

export default () => (
  <SuccessContainer>
    <h1
      css={css`
        font-size: 14px;
        font-weight: bold;
        margin: 0;
        padding-bottom: 24px;
      `}
    >
      Thanks for your feedback
    </h1>
  </SuccessContainer>
);
