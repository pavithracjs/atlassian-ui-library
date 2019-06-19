import React from 'react';
import ContextualSurvey from '../src';

export default () => (
  <ContextualSurvey
    question="How strongly do you agree or disagree with this statement"
    statement="This is a very very very very very very very very very very very very very very very very very very very very very very very very very very very very long question?"
    onDismiss={() => {
      console.log('Dismissed');
    }}
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
);
