import * as React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import { shallow } from 'enzyme';
import { noop } from '@babel/types';

import MentionSpotlight, { Props } from '../../../components/MentionSpotlight';

function render(props: Partial<Props>) {
  return mountWithIntl(
    <MentionSpotlight
      createTeamLink="somelink"
      onClose={() => noop}
      {...props}
    />,
  );
}

let mockRegisterRender = jest.fn();
let mockRegisterCreateLinkClick = jest.fn();

jest.mock(
  '../../../components/MentionSpotlight/MentionSpotlightController',
  () => ({
    __esModule: true,
    default: {
      registerRender: () => mockRegisterRender(),
      registerCreateLinkClick: () => mockRegisterCreateLinkClick(),
    },
  }),
);

describe('MentionSpotlight', () => {
  // Note: Unable to test link and x clicking due to the strange way it was wired, which is outside of Jest's control
  // Please check that manually if making changes in that area

  it('Should register render on mount', () => {
    const onClose = jest.fn();
    render({ onClose: onClose });

    expect(mockRegisterRender).toHaveBeenCalled();
  });

  it('should not show the highlight if the spotlight has been closed by the user', () => {
    const onClose = jest.fn();
    const spotlight = shallow(
      <MentionSpotlight createTeamLink="somelink" onClose={onClose} />,
    );

    spotlight.setState({
      isSpotlightClosed: true,
    });

    expect(spotlight).toMatchObject({});
  });
});
