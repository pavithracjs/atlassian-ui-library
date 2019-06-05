/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import SuccessContainer from './SuccessContainer';

interface Props {}

export default ({  }: Props) => (
  <SuccessContainer>
    <h1
      css={css`
        font-size: 14px;
        font-weight: bold;
        margin: 0;
      `}
    >
      Thanks for signing up
    </h1>
    <p>
      We may reach out to you in the future to participate in additional
      research.
    </p>
  </SuccessContainer>
);
