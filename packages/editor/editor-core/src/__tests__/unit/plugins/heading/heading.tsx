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

  describe('when isTopLevelHeading is false', () => {
    beforeEach(() => {
      props.isTopLevelHeading = false;
    });

    it("should not render 'HeadingAnchor'", () => {
      subject = shallow(<Heading {...props} />);
      expect(subject.find(HeadingAnchor).exists()).toBe(false);
    });
  });

  describe('when headingId is null', () => {
    beforeEach(() => {
      props.headingId = undefined;
    });

    it("should not render 'HeadingAnchor'", () => {
      subject = shallow(<Heading {...props} />);
      expect(subject.find(HeadingAnchor).exists()).toBe(false);
    });
  });
});
