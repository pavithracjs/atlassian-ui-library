import { shallow } from 'enzyme';
import * as React from 'react';
import UserMentionDescriptionHighlight from '../UserMentionDescriptionHighlight';
import { userMention } from './commonData';

const shallowRender = () =>
  shallow(<UserMentionDescriptionHighlight mention={userMention} />);

describe('User mention description', () => {
  it('should render User Mention description component', () => {
    const component = shallowRender();
    expect(component).toMatchSnapshot();
  });
});
