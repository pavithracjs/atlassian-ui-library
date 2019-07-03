import React, { useCallback, useRef, useState, useEffect } from 'react';
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
  /** Callback that is triggered when the user clicks 'Yes' or 'No' to sign up to the Atlassian Research Group */
  onMailingListAnswer: (answer: boolean) => Promise<void>;
}

type Step =
  | 'SURVEY'
  | 'SIGN_UP_PROMPT'
  | 'SIGN_UP_SUCCESS'
  | 'POST_SURVEY_NO_CONSENT'
  | 'POST_SURVEY_HAS_SIGN_UP';

type Optional<T> = T | null;

const AUTO_DISAPPEAR_DURATION: number = 8000;

export default ({
  question,
  statement,
  onDismiss,
  onSubmit,
  onMailingListAnswer,
  getUserHasAnsweredMailingList,
  textPlaceholder = 'Tell us why',
}: Props) => {
  const autoDisappearTimeoutRef = useRef<Optional<number>>(null);
  const [currentStep, setCurrentStep] = useState<Step>('SURVEY');
  // only allow a single dismiss for a component
  const isDismissedRef = useRef<boolean>(false);

  const tryDismiss = useCallback(
    () => {
      // Already called dismiss once
      if (isDismissedRef.current) {
        return;
      }
      isDismissedRef.current = true;
      onDismiss();
    },
    [onDismiss],
  );

  const tryClearTimeout = useCallback(() => {
    const id: Optional<number> = autoDisappearTimeoutRef.current;

    if (id) {
      clearTimeout(id);
      autoDisappearTimeoutRef.current = null;
    }
  }, []);

  const manualDismiss = useCallback(
    () => {
      // clear any pending timers
      tryClearTimeout();
      tryDismiss();
    },
    [onDismiss],
  );

  // Cleanup any auto dismiss after dismiss
  useEffect(
    () => {
      return function unmount() {
        manualDismiss();
      };
    },
    [manualDismiss],
  );

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

  const onMailingListResponse = useCallback(
    async (answer: boolean) => {
      await onMailingListAnswer(answer);
      if (answer) {
        setCurrentStep('SIGN_UP_SUCCESS');
        return;
      }
      setCurrentStep('POST_SURVEY_NO_CONSENT');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setCurrentStep],
  );

  useEffect(
    () => {
      // timeout already scheduled
      if (autoDisappearTimeoutRef.current) {
        return;
      }

      if (
        [
          'SIGN_UP_SUCCESS',
          'POST_SURVEY_NO_CONSENT',
          'POST_SURVEY_HAS_SIGN_UP',
        ].includes(currentStep)
      ) {
        autoDisappearTimeoutRef.current = setTimeout(() => {
          console.log('AUTO DISMISS');
          onDismiss();
        }, AUTO_DISAPPEAR_DURATION);
      }
    },
    [currentStep],
  );

  const content: React.ReactNode = (() => {
    if (currentStep === 'SURVEY') {
      return (
        <SurveyForm
          question={question}
          statement={statement}
          textPlaceholder={textPlaceholder}
          onSubmit={onSurveySubmit}
        />
      );
    }
    if (currentStep === 'SIGN_UP_PROMPT') {
      return <SignUpPrompt onAnswer={onMailingListResponse} />;
    }
    if (currentStep === 'SIGN_UP_SUCCESS') {
      return <SignUpSuccess />;
    }
    if (
      currentStep === 'POST_SURVEY_NO_CONSENT' ||
      currentStep === 'POST_SURVEY_HAS_SIGN_UP'
    ) {
      return <FeedbackAcknowledgement />;
    }

    return null;
  })();

  return <SurveyContainer onDismiss={manualDismiss}>{content}</SurveyContainer>;
};
