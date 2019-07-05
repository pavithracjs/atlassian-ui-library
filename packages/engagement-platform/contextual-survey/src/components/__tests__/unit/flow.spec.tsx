import React, { useState } from 'react';
import invariant from 'tiny-invariant';
import {
  render,
  fireEvent,
  getByPlaceholderText,
} from '@testing-library/react';
import SurveyMarshal from '../../SurveyMarshal';
import ContextualSurvey from '../../ContextualSurvey';

type Props = {
  hasUserAnswered: boolean;
};

function App({ hasUserAnswered }: Props) {
  const [showSurvey, setShowSurvey] = useState(true);

  return (
    <SurveyMarshal shouldShow={showSurvey}>
      {() => (
        <ContextualSurvey
          question="Question"
          statement="Statement"
          textPlaceholder="Placeholder"
          onDismiss={() => setShowSurvey(false)}
          getUserHasAnsweredMailingList={() => Promise.resolve(hasUserAnswered)}
          onMailingListAnswer={() => Promise.resolve()}
          onSubmit={() => Promise.resolve()}
        />
      )}
    </SurveyMarshal>
  );
}

it('should allow a standard signup flow', () => {
  const {
    container,
    getByLabelText,
    getByText,
    queryByPlaceholderText,
    getByPlaceholderText,
  } = render(<App hasUserAnswered={false} />);

  // displaying form initially
  expect(getByText('Question')).toBeTruthy();
  expect(getByText('Statement')).toBeTruthy();

  // text area not visible yet
  expect(queryByPlaceholderText('Placeholder')).toBeFalsy();

  // click a score
  fireEvent.click(getByLabelText('Strongly agree'));

  // text area now visible
  const textArea: HTMLElement = getByPlaceholderText('Placeholder');
  expect(textArea).toBeTruthy();

  // Adding a message to it
  textArea.innerText = 'Custom response message';

  const form: HTMLElement | null = container.querySelector('form');
  if (!form) {
    throw new Error('could not find form');
  }
  fireEvent.submit(form);
});
