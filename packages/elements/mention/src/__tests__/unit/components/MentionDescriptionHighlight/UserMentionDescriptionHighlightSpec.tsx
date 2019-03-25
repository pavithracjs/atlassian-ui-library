import { render } from 'enzyme';
import * as React from 'react';
import UserMentionDescriptionHighlight from '../../../../components/MentionDescriptionHighlight';
import { userMention } from './_commonData';

const shallowRender = () =>
  render(<UserMentionDescriptionHighlight mention={userMention} />);

describe('User mention description', () => {
  it('should render User Mention description component', () => {
    const component = shallowRender();
    expect(component).toMatchSnapshot();
  });
});
