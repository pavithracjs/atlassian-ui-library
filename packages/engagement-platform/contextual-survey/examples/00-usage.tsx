/** @jsx jsx */
import { useState, useCallback } from 'react';
import { Transition } from 'react-transition-group';
import { jsx, css } from '@emotion/core';
import Button from '@atlaskit/button';
import ContextualSurvey, { surveyWidth, surveyMargin } from '../src';

type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

const animationDuration = 300;

const getAnimationProps = (state: TransitionState) => {
  switch (state) {
    case 'entered':
    case 'entering': {
      return {
        translateX: '0',
        opacity: '1',
      };
    }
    case 'exited':
    case 'exiting': {
      return {
        translateX: `${surveyWidth + surveyMargin}px`,
        opacity: '0',
      };
    }
  }
};

interface Props {
  height: string;
}

export default ({ height = '100%' }: Props) => {
  const [showSurvey, setShowSurvey] = useState(false);
  const onClick = useCallback(
    () => {
      setShowSurvey(true);
    },
    [setShowSurvey],
  );

  const onDismiss = useCallback(
    () => {
      setShowSurvey(false);
    },
    [setShowSurvey],
  );

  return (
    <div
      css={css`
        position: relative;
        height: ${height};
        display: flex;
      `}
    >
      <Button appearance="primary" onClick={onClick}>
        Show survey
      </Button>
      <Transition in={showSurvey} timeout={animationDuration} unmountOnExit>
        {(state: TransitionState) => {
          const { translateX, opacity } = getAnimationProps(state);
          return (
            <div
              css={css`
                transform: translateX(${translateX});
                opacity: ${opacity};
                transition: all ${animationDuration}ms ease-in-out;
                transition-property: transform, opacity;
                flex-grow: 1;
              `}
            >
              <ContextualSurvey
                question="How strongly do you agree or disagree with this statement"
                statement="It is easy to find what I'm looking for in Jira"
                onDismiss={onDismiss}
                getUserHasAnsweredMailingList={() => Promise.resolve(false)}
                onSubmit={formValues =>
                  new Promise(resolve => {
                    console.log('submitted value', formValues);
                    setTimeout(resolve, 1000);
                  })
                }
                onSignUp={() =>
                  new Promise(resolve => {
                    console.log('on Sign up');
                    setTimeout(resolve, 1000);
                  })
                }
              />
            </div>
          );
        }}
      </Transition>
    </div>
  );
};
