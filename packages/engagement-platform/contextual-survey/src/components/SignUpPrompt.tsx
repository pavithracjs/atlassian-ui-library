/** @jsx jsx */
import { useState, useCallback } from 'react';
import { jsx, css } from '@emotion/core';
import Button from '@atlaskit/button';
import { fontSize, gridSize } from '@atlaskit/theme';

import SuccessContainer from './SuccessContainer';

interface Props {
  onSignUpAccept: () => Promise<void>;
  onSignUpDecline: () => void;
}

export default ({ onSignUpAccept, onSignUpDecline }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSignUpAcceptClick = useCallback(
    async () => {
      setIsLoading(true);
      await onSignUpAccept();
    },
    [onSignUpAccept, setIsLoading],
  );

  return (
    <SuccessContainer>
      <h1
        css={css`
          font-size: ${fontSize()}px;
          font-weight: 600;
          margin: 0;
          line-height: ${gridSize() * 3}px;
        `}
      >
        Thanks for your feedback
      </h1>
      <p>Are you interested in participating in our research?</p>
      <p>
        Sign up for the{' '}
        <a href="https://www.atlassian.com/research-group">
          Atlassian Research Group
        </a>{' '}
        and we may contact you in the future with research opportunities.
      </p>

      <div
        css={css`
          margin-top: ${gridSize() * 4}px;
          display: flex;
          justify-content: flex-end;

          & > * + * {
            margin-left: ${gridSize()}px;
          }
        `}
      >
        <Button
          appearance="subtle"
          onClick={onSignUpDecline}
          isDisabled={isLoading}
        >
          No, thanks
        </Button>
        <Button
          appearance="primary"
          onClick={handleSignUpAcceptClick}
          isLoading={isLoading}
        >
          Yes, sign me up
        </Button>
      </div>
    </SuccessContainer>
  );
};
