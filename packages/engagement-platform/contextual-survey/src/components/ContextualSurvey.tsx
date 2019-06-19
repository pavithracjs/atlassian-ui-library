import React, { useCallback, useState, useEffect } from 'react';
import SurveyContainer from './SurveyContainer';
import SurveyForm from './SurveyForm';
import SignUpPrompt from './SignUpPrompt';
import SignUpSuccess from './SignUpSuccess';
import FeedbackAcknowledgement from './FeedbackAcknowledgement';
import { FormValues } from '../types';

interface Props {
  /** Question used for the survey */
  question: string;
  /** Optional statement, to be used in conjunction with the question for the survey */
  statement?: string;
  /** Text placeholder for the survey text area */
  textPlaceholder?: string;
  /** Callback that is triggered when the survey should be dismissed */
  onDismiss: () => void;
  /** Gets whether user has already signed up to the Atlassian Research Group list */
  getUserHasAnsweredMailingList: () => boolean | Promise<boolean>;
  /** Callback that is triggered when the survey is submitted, it will get the survey data as a parameter */
  onSubmit: (formValues: FormValues) => Promise<void>;
  /** Callback that is triggered when the user clicks 'Yes' to sign up to the Atlassian Research Group */
  onSignUp: () => Promise<void>;
}

type Step =
  | 'SURVEY'
  | 'SIGN_UP_PROMPT'
  | 'SIGN_UP_SUCCESS'
  | 'POST_SURVEY_NO_CONSENT'
  | 'POST_SURVEY_HAS_SIGN_UP';

const AUTO_DISAPPEAR_DURATION = 8000;

export default ({
  question,
  statement,
  onDismiss,
  onSubmit,
  onSignUp,
  getUserHasAnsweredMailingList,
  textPlaceholder = 'Tell us why',
}: Props) => {
  let autoDisappearTimeout: any;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => clearTimeout(autoDisappearTimeout), []);

  const [currentStep, setCurrentStep] = useState<Step>('SURVEY');

  const onSurveySubmit = useCallback<
    React.ComponentProps<typeof SurveyForm>['onSubmit']
  >(
    async (formValues, _, callback) => {
      const userHasSignedUp = getUserHasAnsweredMailingList();
      await onSubmit(formValues);

      /**
       * Need to call this callback so final-form can clean up before
       * the survey form is unmounted via setCurrentStep below
       */
      callback();

      if (await userHasSignedUp) {
        setCurrentStep('POST_SURVEY_HAS_SIGN_UP');
        return;
      }

      if (formValues.canContact) {
        setCurrentStep('SIGN_UP_PROMPT');
      } else {
        setCurrentStep('POST_SURVEY_NO_CONSENT');
      }
    },
    [getUserHasAnsweredMailingList, onSubmit],
  );

  const onSignUpAccept = useCallback(
    async () => {
      await onSignUp();
      setCurrentStep('SIGN_UP_SUCCESS');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setCurrentStep],
  );

  const triggerAutoDisappear = useCallback(
    () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      autoDisappearTimeout = setTimeout(() => {
        onDismiss();
      }, AUTO_DISAPPEAR_DURATION);
    },
    [onDismiss],
  );

  let content: React.ReactNode = (() => {
    switch (currentStep) {
      case 'SURVEY': {
        return (
          <SurveyForm
            question={question}
            statement={statement}
            textPlaceholder={textPlaceholder}
            onSubmit={onSurveySubmit}
          />
        );
      }
      case 'SIGN_UP_PROMPT': {
        return (
          <SignUpPrompt
            onSignUpDecline={onDismiss}
            onSignUpAccept={onSignUpAccept}
          />
        );
      }
      case 'SIGN_UP_SUCCESS': {
        triggerAutoDisappear();
        return <SignUpSuccess />;
      }
      case 'POST_SURVEY_NO_CONSENT':
      case 'POST_SURVEY_HAS_SIGN_UP': {
        triggerAutoDisappear();
        return <FeedbackAcknowledgement />;
      }
      default:
        return null;
    }
  })();

  return <SurveyContainer onDismiss={onDismiss}>{content}</SurveyContainer>;
};
