import { render } from 'enzyme';
import * as React from 'react';
import TeamMentionDescriptionHighlight from '../../../../components/MentionDescriptionHighlight';
import { teamMention } from './_commonData';

const shallowRender = () =>
  render(<TeamMentionDescriptionHighlight mention={teamMention} />);

describe('Team mention description', () => {
  it('should render Team Mention description component', () => {
    const component = shallowRender();
    expect(component).toMatchSnapshot();
  });
});
