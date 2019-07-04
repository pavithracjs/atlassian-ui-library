/** @jsx jsx */
import { ReactNode, useState } from 'react';
import { jsx, css } from '@emotion/core';
import { Transition } from 'react-transition-group';
import { layers } from '@atlaskit/theme';
import { surveyInnerWidth, surveyOffset } from '../constants';

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
        translateX: `${surveyInnerWidth + surveyOffset}px`,
        opacity: '0',
      };
    }
  }
};

type ChildrenArgs = {
  isOpen: boolean;
};

type Props = {
  shouldShow: boolean;
  children: (args: ChildrenArgs) => ReactNode;
};

export default function SurveyMarshal(props: Props) {
  const { children, shouldShow } = props;

  return (
    <Transition in={shouldShow} timeout={animationDuration} unmountOnExit>
      {(state: TransitionState) => {
        const { translateX, opacity } = getAnimationProps(state);

        return (
          <div
            css={css`
              position: fixed;
              right: ${surveyOffset}px;
              bottom: ${surveyOffset}px;
              z-index: ${layers.flag()};
              transform: translateX(${translateX});
              opacity: ${opacity};
              transition: all ${animationDuration}ms ease-in-out;
              transition-property: transform, opacity;
            `}
          >
            {children({ isOpen: true })}
          </div>
        );
      }}
    </Transition>
  );
}
