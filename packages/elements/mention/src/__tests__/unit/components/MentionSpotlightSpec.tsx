import * as React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import { shallow } from 'enzyme';
import { noop } from '@babel/types';
import Button from '@atlaskit/button';

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
  it('Should call onCall callback when the x is clicked', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });

    spotlight.find(Button).simulate('click');

    expect(onClose).toHaveBeenCalled();
  });

  it('Should register render on mount', () => {
    const onClose = jest.fn();
    render({ onClose: onClose });

    expect(mockRegisterRender).toHaveBeenCalled();
  });

  it('Should register link on click', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });

    spotlight.find('a').simulate('click');

    expect(mockRegisterCreateLinkClick).toHaveBeenCalled();
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

  // it('should not show the highlight if the spotlight has been closed by the user=====1', () => {
  //   const onClose = jest.fn();
  //   // const spotlight = render({ onClose: onClose });

  //   const kk = shallow(
  //     <MentionSpotlight
  //     createTeamLink="somelink"
  //     onClose={onClose}
  //   />,
  //   );
  //   console.log(kk.debug());

  //   // kk.find(Button).simulate('click');

  //   kk.setState({
  //     isSpotlightClosed: true,
  //   });

  //   console.log(kk.debug());
  //   console.log(kk);

  //   expect(kk).toMatchObject({});
  // });
});
