import { shallow, ShallowWrapper } from 'enzyme';
import Heading, { Props } from '../../../../plugins/heading/nodeviews/heading';
import { HeadingAnchor } from '@atlaskit/editor-common';
import React from 'react';

describe('heading', () => {
  let props: Props = {
    level: 1,
    forwardRef: jest.fn(),
    headingId: 'test_id',
    isTopLevelHeading: true,
    onClick: jest.fn(),
  };

  let subject: ShallowWrapper<Heading>;

  afterEach(() => {
    if (subject) {
      subject.unmount();
    }
  });

  it("should render 'HeadingAnchor' correctly", () => {
    subject = shallow(<Heading {...props} />);
    expect(subject.find(HeadingAnchor).exists()).toBe(true);
  });

  it("should not render 'HeadingAnchor' when isTopLevelHeading is false", () => {
    props.isTopLevelHeading = false;
    subject = shallow(<Heading {...props} />);
    expect(subject.find(HeadingAnchor).exists()).toBe(false);
  });

  it("should not render 'HeadingAnchor' when headingId is null", () => {
    props.headingId = undefined;
    subject = shallow(<Heading {...props} />);
    expect(subject.find(HeadingAnchor).exists()).toBe(false);
  });
});
