import { render } from 'enzyme';
import * as React from 'react';
import UserMentionDescriptionByline from '../../../../components/MentionDescriptionByline';
import { userMention } from './_commonData';

const shallowRender = () =>
  render(<UserMentionDescriptionByline mention={userMention} />);

describe('User mention description', () => {
  it('should render User Mention description component', () => {
    const component = shallowRender();
    expect(component).toMatchSnapshot();
  });
});
