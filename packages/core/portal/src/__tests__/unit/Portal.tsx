import React, { ReactNode } from 'react';
import { mount } from 'enzyme';
import Portal from '../..';

const App = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const zIndex = (elem: HTMLElement | void) =>
  elem ? parseInt(elem.style.getPropertyValue('z-index'), 10) : 0;

let wrapper: any;

afterEach(() => wrapper && wrapper.unmount());

test('should create a portal', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>Hi</div>
      </Portal>
    </App>,
  );
  const elements = document.getElementsByClassName('atlaskit-portal');
  expect(wrapper.find(App).html()).toBe('<div></div>');
  expect(elements).toHaveLength(1);
  expect(elements[0].innerHTML).toBe('<div>Hi</div>');
});

test('should use z-index to stack nested portals', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>back</div>
        <Portal zIndex={1}>
          <div>front</div>
        </Portal>
      </Portal>
    </App>,
  );
  const elements = document.getElementsByClassName('atlaskit-portal');
  const getElement = (text: string) =>
    [...((elements as unknown) as Array<HTMLElement>)].find(
      e => e.innerHTML.indexOf(text) > -1,
    );
  const front = getElement('front');
  const back = getElement('back');
  expect(zIndex(front)).toBeGreaterThan(zIndex(back));
});

test('should use DOM ordering to stack sibiling portals', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>back</div>
      </Portal>
      <Portal>
        <div>front</div>
      </Portal>
    </App>,
  );
  const elements = document.getElementsByClassName('atlaskit-portal');
  expect(elements).toHaveLength(2);
  const [back, front] = (elements as unknown) as Array<HTMLElement>;
  expect(zIndex(front)).toEqual(zIndex(back));
  expect(back.nextSibling).toBe(front);
});

test('should create a new stacking context', () => {
  wrapper = mount(
    <App>
      <Portal>
        <div>Hi</div>
      </Portal>
    </App>,
  );
  const container = document.querySelector(
    'body > .atlaskit-portal-container',
  ) as HTMLElement;
  expect(container && container.style.getPropertyValue('display')).toBe('flex');
});

test('should accept a string for zIndex', () => {
  wrapper = mount(
    <App>
      <Portal zIndex="unset">
        <div>Hi</div>
      </Portal>
    </App>,
  );
  const elements = (document.getElementsByClassName(
    'atlaskit-portal',
  ) as unknown) as Array<HTMLElement>;
  expect(elements).toHaveLength(1);
  expect(elements[0].style.getPropertyValue('z-index')).toBe('unset');
});

test('should clean up elements after unmount', () => {
  const Wrapper = ({ renderPortal }: { renderPortal: boolean }) => (
    <App>
      {renderPortal && (
        <Portal zIndex={500}>
          <div>Hi</div>
        </Portal>
      )}
    </App>
  );
  wrapper = mount(<Wrapper renderPortal />);
  wrapper.setProps({ renderPortal: false });
  const parent = document.querySelector('.atlaskit-portal-container');
  expect(parent).toBeNull();
  const portal = document.querySelector('.atlaskit-portal');
  expect(portal).toBeNull();
});

test('portal mounts children only when it is attached to DOM', () => {
  let DOMElement = null;
  class ChildComponent extends React.Component<{}> {
    componentDidMount() {
      DOMElement = document.querySelector('body');
    }

    render() {
      return <div>Hello World!!</div>;
    }
  }

  const Wrapper = ({ renderPortal }: { renderPortal: boolean }) => (
    <App>
      {renderPortal && (
        <Portal zIndex={500}>
          <ChildComponent />
        </Portal>
      )}
    </App>
  );
  wrapper = mount(<Wrapper renderPortal />);
  expect(DOMElement).not.toBeNull();
});
