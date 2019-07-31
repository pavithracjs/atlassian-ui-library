import * as React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
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
let mockIsSpotlightEnabled = true;

jest.mock(
  '../../../components/MentionSpotlight/MentionSpotlightController',
  () => ({
    __esModule: true,
    default: {
      registerRender: () => mockRegisterRender(),
      registerCreateLinkClick: () => mockRegisterCreateLinkClick(),
      isSpotlightEnabled: () => mockIsSpotlightEnabled,
    },
  }),
);

describe('MentionSpotlight', () => {
  beforeEach(() => {
    mockIsSpotlightEnabled = true;
  });

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
    const spotlight = render({ onClose: onClose });

    spotlight.setState({
      isSpotlightHidden: true,
    });

    expect(spotlight.isEmptyRender()).toBeTruthy();
  });

  it('should not show spotlight after re-render if the Spotlight Controller asked not to render it at the first mount', () => {
    mockIsSpotlightEnabled = false;
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });

    expect(spotlight.isEmptyRender()).toBeTruthy();

    // after first render, ask controller to show it
    mockIsSpotlightEnabled = true;

    //should still hide the spotlight after re-render
    spotlight.render();
    expect(spotlight.isEmptyRender()).toBeTruthy();
  });

  it('should show spotlight after re-render if the Spotlight Controller asked to render it at the first mount', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });

    // Should render in the first time
    expect(spotlight.isEmptyRender()).toBeFalsy();

    //after first render, ask controller to hide it
    mockIsSpotlightEnabled = false;

    //should still show the spotlight after re-render
    spotlight.render();
    expect(spotlight.isEmptyRender()).toBeFalsy();
  });
});
