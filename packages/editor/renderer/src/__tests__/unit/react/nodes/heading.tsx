import * as React from 'react';
import Heading from '../../../../react/nodes/heading';
import { HeadingLevel } from '../../../../react/nodes/heading';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';

describe('<Heading />', () => {
  let headers: any[] = [];
  let headingWithAnchorLink: any;
  for (let i = 1; i < 7; i++) {
    const header = mountWithIntl(
      <Heading level={i as HeadingLevel} headingId={`This-is-a-Heading-${i}`}>
        This is a Heading {i}
      </Heading>,
    );
    headers.push(header);
  }

  it('should wrap content with <h1>-tag', () => {
    expect(headers[0].find('h1').exists()).toBe(true);
    expect(headers[0].find('h1').prop('id')).toEqual('This-is-a-Heading-1');
  });

  it('should wrap content with <h2>-tag', () => {
    expect(headers[1].find('h2').exists()).toBe(true);
    expect(headers[1].find('h2').prop('id')).toEqual('This-is-a-Heading-2');
  });

  it('should wrap content with <h3>-tag', () => {
    expect(headers[2].find('h3').exists()).toBe(true);
    expect(headers[2].find('h3').prop('id')).toEqual('This-is-a-Heading-3');
  });

  it('should wrap content with <h4>-tag', () => {
    expect(headers[3].find('h4').exists()).toBe(true);
    expect(headers[3].find('h4').prop('id')).toEqual('This-is-a-Heading-4');
  });

  it('should wrap content with <h5>-tag', () => {
    expect(headers[4].find('h5').exists()).toBe(true);
    expect(headers[4].find('h5').prop('id')).toEqual('This-is-a-Heading-5');
  });

  it('should wrap content with <h6>-tag', () => {
    expect(headers[5].find('h6').exists()).toBe(true);
    expect(headers[5].find('h6').prop('id')).toEqual('This-is-a-Heading-6');
  });

  it('should render with "id"-attribute if headingId-prop is set', () => {
    const heading = mountWithIntl(
      <Heading level={1} headingId="Heading 1">
        Heading 1
      </Heading>,
    );
    expect(heading.find('h1').exists()).toBe(true);
    expect(heading.find('h1').prop('id')).toEqual('Heading 1');
  });

  describe('When showAnchorLink is set to true', () => {
    beforeEach(() => {
      headingWithAnchorLink = mountWithIntl(
        <Heading
          level={1}
          headingId={`This-is-a-Heading-${1}`}
          showAnchorLink={true}
        >
          This is a Heading {1}
        </Heading>,
      );
    });

    it('shows anchor link when hover', () => {
      headingWithAnchorLink.simulate('mouseEnter');
      expect(headingWithAnchorLink.find('a').exists()).toBe(true);
      headingWithAnchorLink.simulate('mouseLeave');
      expect(headingWithAnchorLink.find('a').exists()).toBe(false);
    });
  });
});
