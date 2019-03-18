import { render } from 'enzyme';
import * as React from 'react';
import TeamMentionDescriptionHighlight from '../../../../components/MentionDescriptionHighlight';
import { teamMention } from './_commonData';

const shallowRender = (memberCount: number, includesYou: boolean) => {
  const updatedMention = {
    ...teamMention,
    context: {
      members: [
        {
          id: 'user-1234',
          name: 'Test User',
        },
      ],
      ...teamMention.context,
      includesYou: includesYou,
      memberCount: memberCount,
    },
  };
  return render(<TeamMentionDescriptionHighlight mention={updatedMention} />);
};

describe('Team mention description', () => {
  it('should render Team Mention description component with less than 50 members, includes you', () => {
    const component = shallowRender(5, true);
    expect(component).toMatchSnapshot();
  });

  it('should render Team Mention description component with more than 50 members, includes you', () => {
    const component = shallowRender(55, true);
    expect(component).toMatchSnapshot();
  });

  it('should render Team Mention description component with less than 50 members, not including you', () => {
    const component = shallowRender(4, false);
    expect(component).toMatchSnapshot();
  });

  it('should render Team Mention description component with more than 50 members, not including you', () => {
    const component = shallowRender(100, false);
    expect(component).toMatchSnapshot();
  });
});
