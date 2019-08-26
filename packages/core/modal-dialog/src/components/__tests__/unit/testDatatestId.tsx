import React from 'react';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import cases from 'jest-in-case';
// import Blanket from '@atlaskit/blanket';

import ModalDialog, { ModalTransition } from '../../..';
// import Positioner from '../../Positioner';
// import Content from '../../Content';
// import Header from '../../Header';
// import Footer from '../../Footer';

// dialogs require an onClose function
const noop = () => {};

const MyContent = () => <div>Hello</div>;
const wrapperWithTestId = (
  <ModalTransition>
    <ModalDialog onClose={noop} testId="iamTheDataTestId">
      <MyContent />
    </ModalDialog>
  </ModalTransition>
);

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(
      <ModalTransition>
        <ModalDialog onClose={noop}>
          <MyContent />
        </ModalDialog>
      </ModalTransition>,
    );
    expect(wrapper).toBeDefined();
    expect(wrapper.text()).toBe('Hello');
    expect(wrapper.prop('data-testid')).toBeUndefined();
  });
  test('Modal-dialog snapshot should be same with data-testid ', () => {
    const wrapper = mount(wrapperWithTestId);
    expect(
      wrapper.find('div[data-testid="iamTheDataTestId"]'),
    ).toMatchSnapshot();
  });

  describe('Modal-dialog with different data-testid', () => {
    cases(
      'should be generated',
      ({ key }: { key: string }) => {
        const wrapper = mount(wrapperWithTestId);
        expect(wrapper.find(`[data-testid='${key}']`)).toBeTruthy();
      },
      [
        { key: 'josefGiTan' },
        { key: 'ZZZZŹŽ;;;;' },
        { key: '@3$&&&&Helooo' },
        { key: '126^^^' },
        { key: 123 },
      ],
    );
  });
});

describe('Using react-test-library', () => {
  describe('Modal should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const { getByTestId } = render(wrapperWithTestId);
      expect(getByTestId('iamTheDataTestId')).toBeTruthy();
    });

    test('Using container snapshot', () => {
      const { container } = render(wrapperWithTestId);
      expect(container).toMatchSnapshot();
    });
  });
});

describe.skip('Modal-dialog content', () => {});
describe.skip('Modal-dialog footer', () => {});
describe.skip('Modal-dialog button', () => {});
