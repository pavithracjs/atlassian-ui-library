import React from 'react';
import ContextualSurvey from '../src';

export default () => (
  <ContextualSurvey
    question="How strongly do you agree or disagree with this statement?"
    statement="It is easy to find what I'm looking for in Jira"
    onDismiss={() => {
      console.log('Dismissed');
    }}
    getUserHasSignedUp={() => Promise.resolve(true)}
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
