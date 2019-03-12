import { shallow } from 'enzyme';
import * as React from 'react';
import TeamMentionDescriptionHighlight from '../../TeamMentionDescriptionHighlight';
import { teamMention } from '../commonData';

const shallowRender = () =>
  shallow(<TeamMentionDescriptionHighlight mention={teamMention} />);

describe('Team mention description', () => {
  it('should render Team Mention description component', () => {
    const component = shallowRender();
    expect(component).toMatchSnapshot();
  });
});
