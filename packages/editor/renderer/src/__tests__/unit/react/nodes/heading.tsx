import * as React from 'react';
import Heading from '../../../../react/nodes/heading';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import { HeadingLevels } from '../../../../../../editor-core/src/plugins/block-type/types';
import { CopyTextContext } from '@atlaskit/editor-common/src/ui/CopyTextProvider';

describe('<Heading />', () => {
  let headers: any[] = [];
  let heading: any;
  const copyTextToClipboard = jest.fn();

  for (let i = 1; i < 7; i++) {
    const header = mountWithIntl(
      <Heading
        level={i as HeadingLevels}
        headingId={`This-is-a-Heading-${i}`}
        showAnchorLink={true}
      >
        This is a Heading {i}
      </Heading>,
    );
    headers.push(header);
  }

  it('should wrap content with <h1>-tag', () => {
    expect(headers[0].find('h1').exists()).toBe(true);
    expect(headers[0].find('.heading-anchor').prop('id')).toEqual(
      'This-is-a-Heading-1',
    );
  });

  it('should wrap content with <h2>-tag', () => {
    expect(headers[1].find('h2').exists()).toBe(true);
    expect(headers[1].find('.heading-anchor').prop('id')).toEqual(
      'This-is-a-Heading-2',
    );
  });

  it('should wrap content with <h3>-tag', () => {
    expect(headers[2].find('h3').exists()).toBe(true);
    expect(headers[2].find('.heading-anchor').prop('id')).toEqual(
      'This-is-a-Heading-3',
    );
  });

  it('should wrap content with <h4>-tag', () => {
    expect(headers[3].find('h4').exists()).toBe(true);
    expect(headers[3].find('.heading-anchor').prop('id')).toEqual(
      'This-is-a-Heading-4',
    );
  });

  it('should wrap content with <h5>-tag', () => {
    expect(headers[4].find('h5').exists()).toBe(true);
    expect(headers[4].find('.heading-anchor').prop('id')).toEqual(
      'This-is-a-Heading-5',
    );
  });

  it('should wrap content with <h6>-tag', () => {
    expect(headers[5].find('h6').exists()).toBe(true);
    expect(headers[5].find('.heading-anchor').prop('id')).toEqual(
      'This-is-a-Heading-6',
    );
  });

  describe('When showAnchorLink is set to false', () => {
    beforeEach(() => {
      heading = mountWithIntl(
        <Heading
          level={1}
          headingId={'This-is-a-Heading-1'}
          showAnchorLink={false}
        >
          This is a Heading 1
        </Heading>,
      );
    });

    it('shows anchor link when hover', () => {
      expect(heading.find('.heading-anchor').exists()).toBe(false);
    });
  });

  describe('When click on copy anchor link button', () => {
    beforeEach(() => {
      heading = mountWithIntl(
        <CopyTextContext.Provider
          value={{
            copyTextToClipboard: copyTextToClipboard,
          }}
        >
          <Heading
            level={1}
            headingId="This-is-a-Heading-1"
            showAnchorLink={true}
          >
            This is a Heading 1
          </Heading>
          ,
        </CopyTextContext.Provider>,
      );
    });

    it('Should call "copyTextToClipboard" with correct param', () => {
      heading
        .find('#This-is-a-Heading-1')
        .find('button')
        .simulate('click');
      expect(copyTextToClipboard).toHaveBeenCalledWith(
        'http://localhost/#This-is-a-Heading-1',
      );
    });
  });
});
