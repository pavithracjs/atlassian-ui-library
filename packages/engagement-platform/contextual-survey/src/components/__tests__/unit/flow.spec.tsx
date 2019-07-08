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
            console.log('resolving if user has answered', hasUserAnswered);
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
    console.log('resolving on submit');
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
  // This will also automatically check the "contact me" checkbox
  fireEvent.change(textArea, { target: { value: feedback } });

  const form: HTMLElement | null = container.querySelector('form');
  if (!form) {
    throw new Error('could not find form');
  }
  console.log('manually submitting form');
  fireEvent.submit(form);

  console.log('post submit')

  expect(onSubmit).toHaveBeenCalledWith({
    canContact: false,
    feedbackScore: 7,
    writtenFeedback: feedback,
  });



  console.log('YO: running assertion');
  // expect(
  //   getByText('Are you interested in participating in our research?'),
  // ).toBeTruthy();
});
