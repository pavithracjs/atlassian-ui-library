import { shallow } from 'enzyme';
import * as React from 'react';
import { TeamOption, TeamOptionProps } from '../../../components/TeamOption';
import { Team } from '../../../types';

describe('Team Option', () => {
  const basicTeam: Team = {
    id: 'team-7',
    name: 'Team-1',
    avatarUrl: 'https://avatars.atlassian.com/team-1.png',
    type: 'team',
  };

  const shallowOption = (props: Partial<TeamOptionProps> = {}, team: Team) =>
    shallow(<TeamOption team={team} isSelected={false} {...props} />);

  const buildTeam = (teamData: Partial<Team> = {}): Team => {
    return {
      ...basicTeam,
      ...teamData,
    };
  };

  it('should not render byline if member count is undefined', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({ includesYou: true }),
    );
    expect(component).toMatchSnapshot();
  });

  it('should render correct byline if includesYou is undeifned and memberCount <= 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        memberCount: 45,
      }),
    );
    expect(component).toMatchSnapshot();
  });

  it('should render correct byline if includesYou is undeifned and memberCount > 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        memberCount: 51,
      }),
    );
    expect(component).toMatchSnapshot();
  });

  it('should render correct byline if includesYou = false and memberCount <= 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        includesYou: false,
        memberCount: 45,
      }),
    );
    expect(component).toMatchSnapshot();
  });

  it('should render correct byline if includesYou = false and memberCount > 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        includesYou: false,
        memberCount: 51,
      }),
    );
    expect(component).toMatchSnapshot();
  });

  it('should render correct byline if includesYou = true and memberCount <= 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        includesYou: true,
        memberCount: 45,
      }),
    );
    expect(component).toMatchSnapshot();
  });

  it('should render correct byline if includesYou = true and memberCount > 50', () => {
    const component = shallowOption(
      { isSelected: true },
      buildTeam({
        includesYou: true,
        memberCount: 51,
      }),
    );
    expect(component).toMatchSnapshot();
  });
});
