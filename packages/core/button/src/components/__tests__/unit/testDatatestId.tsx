import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import React from 'react';
import cases from 'jest-in-case';
import Button from '../../Button';

test('It should not generate data-testid', () => {
  const wrapper = mount(<Button>Button</Button>);
  expect(wrapper).toBeDefined();
  expect(wrapper.text()).toBe('Button');
  expect(wrapper.prop('data-testid')).toBeUndefined();
});

describe('Button should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const { getByTestId } = render(
      <Button data-testid="iamTheDataTestId">Button</Button>,
    );

    expect(getByTestId('iamTheDataTestId')).toBeTruthy();
  });

  test('Using container snapshot', () => {
    const { container } = render(
      <Button data-testid="iamTheDataTestId">Button</Button>,
    );
    expect(container).toMatchSnapshot();
  });
});

test('Button snapshot should be same with data-testid ', () => {
  const wrapper = mount(<Button data-testid="iamTheDataTestId">Button</Button>);
  expect(
    wrapper.find('button[data-testid="iamTheDataTestId"]'),
  ).toMatchSnapshot();
});

describe('Button with different data-testid', () => {
  cases(
    'should be generated',
    ({ key }: { key: string }) => {
      const wrapper = mount(<Button data-testid={key}>Button</Button>);
      expect(wrapper.prop('data-testid')).toBeDefined();
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
