import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import EditorHeadingAnchor from '../../../../../plugins/heading/ui/editor-heading-anchor';

describe('EditorHeadingAnchor', () => {
  const props = {
    onClick: jest.fn(),
    locale: 'en',
    dispatchAnalyticsEvent: jest.fn(),
  };
  let subject: ReactWrapper<any, any, any>;

  afterEach(() => {
    if (subject) {
      subject.unmount();
    }
  });

  it("calls 'dispatchAnalyticsEvent' with correct params when clicked", () => {
    subject = mount(<EditorHeadingAnchor {...props} />);
    subject.find('button').simulate('click');
    expect(props.dispatchAnalyticsEvent).toBeCalledWith({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'headingAnchorLink',
      eventType: 'ui',
    });
  });
});
