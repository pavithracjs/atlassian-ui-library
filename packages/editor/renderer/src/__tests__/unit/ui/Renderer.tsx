import * as React from 'react';
import { mount } from 'enzyme';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
import { analyticsClient } from '@atlaskit/editor-test-helpers';
import { EDITOR_APPEARANCE_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import Renderer, { Renderer as BaseRenderer } from '../../../ui/Renderer';
import { RendererAppearance } from '../../../ui/Renderer/types';

const validDoc = {
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello, ',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'World!',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        },
      ],
    },
  ],
};

describe('@atlaskit/renderer/ui/Renderer', () => {
  it('should re-render when appearance changes', () => {
    const doc = {
      type: 'doc',
      content: 'foo',
    };

    const renderer = mount(<Renderer document={doc} />);
    const renderSpy = jest.spyOn(
      renderer.find(BaseRenderer).instance() as any,
      'render',
    );
    renderer.setProps({ appearance: 'full-width' });
    renderer.setProps({ appearance: 'full-page' });
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('should catch errors and render unsupported content text', () => {
    const doc = {
      type: 'doc',
      content: 'foo',
    };

    const renderer = mount(<Renderer document={doc} />);
    expect(renderer.find('UnsupportedBlockNode')).toHaveLength(1);
    renderer.unmount();
  });

  describe('Stage0', () => {
    const docWithStage0Mark = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World',
              marks: [
                {
                  type: 'confluenceInlineComment',
                  attrs: {
                    reference: 'ref',
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    it('should remove stage0 marks if flag is not explicitly set to "stage0"', () => {
      const renderer = mount(<Renderer document={docWithStage0Mark} />);
      expect(renderer.find('ConfluenceInlineComment')).toHaveLength(0);
      renderer.unmount();
    });

    it('should keep stage0 marks if flag is explicitly set to "stage0"', () => {
      const renderer = mount(
        <Renderer document={docWithStage0Mark} adfStage="stage0" />,
      );
      expect(renderer.find('ConfluenceInlineComment')).toHaveLength(1);
      renderer.unmount();
    });
  });

  describe('Truncated Renderer', () => {
    it('should truncate to 95px when truncated prop is true and maxHeight is undefined', () => {
      const renderer = mount(<Renderer truncated={true} document={validDoc} />);

      expect(renderer.find('TruncatedWrapper')).toHaveLength(1);

      const wrapper = renderer.find('TruncatedWrapper').childAt(0);
      expect(wrapper.props().height).toEqual(95);
      renderer.unmount();
    });

    it('should truncate to custom height when truncated prop is true and maxHeight is defined', () => {
      const renderer = mount(
        <Renderer truncated={true} maxHeight={100} document={validDoc} />,
      );
      expect(renderer.find('TruncatedWrapper')).toHaveLength(1);
      expect(renderer.find('TruncatedWrapper').props().height).toEqual(100);

      renderer.unmount();
    });

    it("shouldn't truncate when truncated prop is undefined and maxHeight is defined", () => {
      const renderer = mount(<Renderer maxHeight={100} document={validDoc} />);
      expect(renderer.find('TruncatedWrapper')).toHaveLength(0);
      renderer.unmount();
    });

    it("shouldn't truncate when truncated prop is undefined and maxHeight is undefined", () => {
      const renderer = mount(<Renderer document={validDoc} />);
      expect(renderer.find('TruncatedWrapper')).toHaveLength(0);
      renderer.unmount();
    });
  });

  describe('Analytics', () => {
    it('should fire analytics event on renderer started', () => {
      const client = analyticsClient();
      const oldHash = window.location.hash;
      window.location.hash = '#test';
      jest
        .spyOn(document, 'getElementById')
        .mockImplementation(() => document.createElement('div'));

      mount(
        <FabricAnalyticsListeners client={client}>
          <Renderer document={validDoc} />
        </FabricAnalyticsListeners>,
      );

      expect(client.sendUIEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'started',
          actionSubject: 'renderer',
          attributes: expect.objectContaining({ platform: 'web' }),
        }),
      );

      expect(client.sendUIEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'viewed',
          actionSubject: 'anchorLink',
          attributes: expect.objectContaining({
            platform: 'web',
            mode: 'renderer',
          }),
        }),
      );

      window.location.hash = oldHash;
      (document.getElementById as jest.Mock).mockRestore();
    });

    const appearances: {
      appearance: RendererAppearance;
      analyticsAppearance: EDITOR_APPEARANCE_CONTEXT;
    }[] = [
      {
        appearance: 'full-page',
        analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.FIXED_WIDTH,
      },
      {
        appearance: 'comment',
        analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.COMMENT,
      },
      {
        appearance: 'full-width',
        analyticsAppearance: EDITOR_APPEARANCE_CONTEXT.FULL_WIDTH,
      },
    ];
    appearances.forEach(appearance => {
      it(`adds appearance to analytics events for ${
        appearance.appearance
      } renderer`, () => {
        const client = analyticsClient();
        mount(
          <FabricAnalyticsListeners client={client}>
            <Renderer document={validDoc} appearance={appearance.appearance} />
          </FabricAnalyticsListeners>,
        );

        expect(client.sendUIEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              appearance: appearance.analyticsAppearance,
            }),
          }),
        );
      });
    });
  });
});
