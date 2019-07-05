import React, { useState } from 'react';
import {
  render,
  fireEvent,
  getByPlaceholderText,
  act,
} from '@testing-library/react';
import SurveyMarshal from '../../SurveyMarshal';
import { FormValues } from '../../../types';
import ContextualSurvey from '../../ContextualSurvey';

type Props = {
  hasUserAnswered: boolean;
  onSubmit: (value: FormValues) => Promise<void>;
};

function App({ hasUserAnswered, onSubmit }: Props) {
  const [showSurvey, setShowSurvey] = useState(true);

  return (
    <SurveyMarshal shouldShow={showSurvey}>
      {() => (
        <ContextualSurvey
          question="Question"
          statement="Statement"
          textPlaceholder="Placeholder"
          onDismiss={() => setShowSurvey(false)}
          getUserHasAnsweredMailingList={() => {
            console.log('resolving if user has answeered', hasUserAnswered);
            return Promise.resolve(hasUserAnswered);
          }}
          onMailingListAnswer={() => Promise.resolve()}
          onSubmit={onSubmit}
        />
      )}
    </SurveyMarshal>
  );
}

it('should allow a standard signup flow', async () => {
  const onSubmit = jest.fn().mockImplementation(() => {
    return Promise.resolve();
  });
  const {
    container,
    getByLabelText,
    getByText,
    getAllByLabelText,
    queryByPlaceholderText,
    getByPlaceholderText,
  } = render(<App hasUserAnswered={false} onSubmit={onSubmit} />);

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

  const feedback: string = 'Custom response message';
  // Adding a message to textarea
  act(() => {
    console.log('firing change');
    fireEvent.change(textArea, { target: { value: feedback } });
  });
  act(() => {
    fireEvent.change(
      getAllByLabelText('Atlassian can contact me about this feedback')[0],
      { target: { value: feedback } },
    );
  });

  const form: HTMLElement | null = container.querySelector('form');
  if (!form) {
    throw new Error('could not find form');
  }
  console.log('submitting form');
  fireEvent.submit(form);

  await new Promise(resolve => {
    act(resolve);
  });

  expect(onSubmit).toHaveBeenCalledWith({
    canContact: false,
    feedbackScore: 7,
    writtenFeedback: feedback,
  });

  await new Promise(resolve => {
    act(resolve);
  });

  await new Promise(resolve => {
    act(resolve);
  });

  expect(
    getByText('Are you interested in participating in our research?'),
  ).toBeTruthy();
});
