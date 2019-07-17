import * as React from 'react';
import { shallow } from 'enzyme';
import { Content } from '../../../newgen/content';
import {
  InactivityDetector,
  WithShowControlMethodProp,
} from '@atlaskit/media-ui';

class DummyChild extends React.Component<WithShowControlMethodProp> {
  render() {
    return null;
  }
}

describe('<Content />', () => {
  const setup = () => {
    const showControls = jest.fn();
    const component = shallow(
      <Content>
        <DummyChild />
      </Content>,
    );
    component.props().showControlsRegister(showControls);

    return {
      component,
      showControls,
    };
  };

  it('should render children', () => {
    const { component } = setup();
    expect(component.find(InactivityDetector).children()).toHaveLength(2);
  });

  it('should allow children to show controls', () => {
    const { component, showControls } = setup();
    const childrenShowControls = component
      .find(DummyChild)
      .prop('showControls');
    expect(childrenShowControls).toBeDefined();
    expect(childrenShowControls).toBe(showControls);
  });
});
