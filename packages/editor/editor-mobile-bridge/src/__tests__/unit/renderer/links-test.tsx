import { mount } from 'enzyme';
import * as React from 'react';
import { ResolveResponse } from '@atlaskit/smart-card';
import { MobileSmartCardClient } from '../../../providers/cardProvider';
import MobileRenderer from '../../../renderer/mobile-renderer-element';

type MockedEvent = { preventDefault: () => void; defaultPrevented: boolean };

function createMockedPreventableEvent(): MockedEvent {
  const e: MockedEvent = {
    defaultPrevented: false,
    preventDefault: () => {},
  };
  e.preventDefault = jest.fn(() => {
    e.defaultPrevented = true;
  });
  return e;
}

class MockedMobileSmartCardClient extends MobileSmartCardClient {
  async fetchData(url: string) {
    return Promise.resolve({
      meta: {
        visibility: 'restricted',
        access: 'unauthorized',
        auth: [
          {
            displayName: 'github.com',
            key: 'default',
            url:
              'https://id.atlassian.com/outboundAuth/start?containerId=12e35df3-21ea-4225-bd53-7a6be9760507&serviceKey=default',
          },
        ],
        definitionId: 'c16ac6b8-6717-4d75-87ef-ff187a1aaaab',
      },
      data: {
        '@context': {
          '@vocab': 'https://www.w3.org/ns/activitystreams#',
          atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
          schema: 'http://schema.org/',
        },
        '@type': 'Object',
        url: 'https://github.com/ProseMirror/prosemirror-view',
        'atlassian:updatedBy': {
          '@type': 'Person',
          image: 'https://avatars.githubusercontent.com/u/20928690?',
          name: 'tuser',
        },
        generator: {
          '@type': 'Application',
          icon: {
            '@type': 'Image',
            url: 'https://github.githubassets.com/favicon.ico',
          },
          name: 'Github Object Provider',
        },
      },
    } as ResolveResponse);
  }
}

const mockCardClient = new MockedMobileSmartCardClient();

// Note: the mobile renderer alters the prop type of `document` to require a string
// representation of ADF, despite the base renderer supporting either a string or an object.
// For some reason, a string version fails to populate the content within Enzyme.
// Here we cast back to an object, which would usually complain about types, but conveniently
// JSON.parse returns `any`.
const linkADF = JSON.parse(`{
  "version": 1,
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "I'm a normal link",
          "marks": [
            {
              "type": "link",
              "attrs": {
                "href": "http://prosemirror.net"
              }
            }
          ]
        }
      ]
    }
  ]
}`);
const smartLinkADF = JSON.parse(`{
  "version": 1,
  "type": "doc",
  "content": [
    {
      "type": "inlineCard",
      "attrs": {
        "url": "https://github.com/ProseMirror/prosemirror-view",
        "data": null
      }
    }
  ]
}`);

/**
 * This test suite ensures that clicking links inside the mobile renderer
 * correctly prevent the default browser behaviour.
 *
 * These tests mount the `<MobileRenderer />` component in order to
 * test the link click handlers which get defined in that file, and
 * are passed into the instance via the `eventHandler` prop.
 *
 * Unfortunately, the below warning is logged by `react-dom` because the
 * rendered smart card component uses async state updates.
 * We don't have the opportunity to wrap them in `act()` in this case.
 *
 * `Warning: An update to CardWithUrlContent inside a test was not wrapped in act(...).`
 */
describe('renderer bridge: links', () => {
  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
  });

  it('should prevent WebView redirection when clicking regular links', () => {
    const mobileRenderer = mount(<MobileRenderer document={linkADF} />);

    const normalLink = mobileRenderer.find('a:not([role])').first();
    const mockMouseEvent = createMockedPreventableEvent();
    normalLink.simulate('click', mockMouseEvent);
    expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
    expect(mockMouseEvent.defaultPrevented).toEqual(true);

    mobileRenderer.unmount();
  });

  it('should prevent WebView redirection when clicking smart links', async done => {
    const mobileRenderer = mount(
      <MobileRenderer document={smartLinkADF} cardClient={mockCardClient} />,
    );

    // Wait 100ms for the smart link provider to resolve the url's data and re-render
    await new Promise(resolve => {
      setTimeout(() => {
        mobileRenderer.update();
        resolve();
      }, 100);
    });

    const smartLink = mobileRenderer
      .find('span[data-inline-card] a[role]')
      .first();
    const mockMouseEvent = createMockedPreventableEvent();
    smartLink.simulate('click', mockMouseEvent);
    expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
    expect(mockMouseEvent.defaultPrevented).toEqual(true);

    mobileRenderer.unmount();
    done();
  });
});
