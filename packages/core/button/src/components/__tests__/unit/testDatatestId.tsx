import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';
import Button from '../../Button';

describe('Using enzyme', () => {
  test('It should not generate data-testid', () => {
    const wrapper = mount(<Button>Button</Button>);
    expect(wrapper).toBeDefined();
    expect(wrapper.text()).toBe('Button');
    expect(wrapper.prop('data-testid')).toBeUndefined();
  });
  test('Button snapshot should be same with data-testid ', () => {
    const wrapper = mount(<Button testId="iamTheDataTestId">Button</Button>);
    expect(
      wrapper.find('button[data-testid="iamTheDataTestId"]'),
    ).toMatchSnapshot();
  });
  describe('Button with different data-testid', () => {
    cases(
      'should be generated',
      ({ key }: { key: string }) => {
        const wrapper = mount(<Button testId={key}>Button</Button>);
        expect(wrapper.find(`button[data-testid='${key}']`)).toBeTruthy();
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
  describe('Button should be found by data-testid', () => {
    test('Using getByTestId()', async () => {
      const { getByTestId } = render(
        <Button testId="iamTheDataTestId">Button</Button>,
      );

      expect(getByTestId('iamTheDataTestId')).toBeTruthy();
    });

    test('Using container snapshot', () => {
      const { container } = render(
        <Button testId="iamTheDataTestId">Button</Button>,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
