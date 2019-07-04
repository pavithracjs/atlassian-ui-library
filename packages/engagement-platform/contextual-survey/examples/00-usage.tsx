/** @jsx jsx */
import React, { useState, useCallback } from 'react';
import { jsx, css } from '@emotion/core';
import Button from '@atlaskit/button';
import { ContextualSurvey, SurveyMarshal } from '../src';

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
    <React.Fragment>
      <Button appearance="primary" onClick={onClick}>
        Show survey
      </Button>
      <SurveyMarshal shouldShow={showSurvey}>
        {({ isOpen }) =>
          isOpen && (
            <ContextualSurvey
              question="How strongly do you agree or disagree with this statement"
              statement="It is easy to find what I'm looking for in Jira"
              onDismiss={onDismiss}
              getUserHasAnsweredMailingList={() => Promise.resolve(false)}
              onMailingListAnswer={(answer: boolean) =>
                new Promise(resolve => {
                  console.log('did sign up to mailing list:', answer);
                  setTimeout(resolve, 1000);
                })
              }
              onSubmit={formValues =>
                new Promise(resolve => {
                  console.log('submitted value', formValues);
                  setTimeout(resolve, 1000);
                })
              }
            />
          )
        }
      </SurveyMarshal>
    </React.Fragment>
  );
};
