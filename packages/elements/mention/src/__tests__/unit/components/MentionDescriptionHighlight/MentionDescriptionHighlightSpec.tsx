import { shallow } from 'enzyme';
import * as React from 'react';
import { MentionDescription } from '../../../../types';
import MentionDescriptionHighlight from '../../../../components/MentionDescriptionHighlight';
import { userMention, teamMention } from './_commonData';

const shallowRender = (mention: MentionDescription) =>
  shallow(<MentionDescriptionHighlight mention={mention} />);

describe('Mention Description Highlight', () => {
  it('should render User Mention description if a user is provided', () => {
    const component = shallowRender(userMention);
    expect(component).toMatchSnapshot();
  });

  it('should render Team Mention description if a team is provided', () => {
    const component = shallowRender(teamMention);
    expect(component).toMatchSnapshot();
  });
});
