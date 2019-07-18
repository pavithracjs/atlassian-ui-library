const mockPlugins = jest.genMockFromModule<any>('../../../plugins');
jest.mock('../../../plugins', () => mockPlugins);

import createPluginsList from '../../../create-editor/create-plugins-list';
import { EditorProps } from 'src/types';

const createAnalyticsEvent = jest.fn();

const testDefaultPlugin = (pluginName: string, pluginParams?: any[]) => {
  const plugin = mockPlugins[pluginName];

  it(`should add ${pluginName} by default`, () => {
    const plugins = createPluginsList({}, createAnalyticsEvent);
    if (typeof plugin === 'function') {
      expect(plugin).toHaveBeenCalledTimes(1);
      if (pluginParams) {
        expect(plugin).toHaveBeenCalledTimes(1);
        expect(plugin).toHaveBeenCalledWith(...pluginParams);
      }
    } else {
      expect(plugins).toContain(plugin);
    }
  });
};

const testBooleanConfiguredPlugin = (
  pluginName: string,
  prop: keyof EditorProps,
  pluginParams?: any[],
) => {
  const plugin = mockPlugins[pluginName];
  const isFunctionPlugin = typeof plugin === 'function';

  it(`should add ${pluginName} if ${prop as string} is enabled`, () => {
    const plugins = createPluginsList({ [prop]: true }, createAnalyticsEvent);
    if (isFunctionPlugin) {
      expect(plugin).toHaveBeenCalledTimes(1);
      if (pluginParams) {
        expect(plugin).toHaveBeenCalledTimes(1);
        expect(plugin).toHaveBeenCalledWith(...pluginParams);
      }
    } else {
      expect(plugins).toContain(plugin);
    }
  });

  it(`should not add ${plugin.name} if ${prop as string} is disabled`, () => {
    const plugins = createPluginsList({ [prop]: false }, createAnalyticsEvent);
    if (isFunctionPlugin) {
      expect(plugin).not.toHaveBeenCalled();
    } else {
      expect(plugins).not.toContain(plugin);
    }
  });

  it(`should not add ${
    plugin.name
  } if ${prop as string} is not specified`, () => {
    const plugins = createPluginsList({}, createAnalyticsEvent);
    if (isFunctionPlugin) {
      expect(plugin).not.toHaveBeenCalled();
    } else {
      expect(plugins).not.toContain(plugin);
    }
  });
};

describe('createPluginsList', () => {
  beforeEach(() => {
    for (const plugin in mockPlugins) {
      if (typeof mockPlugins[plugin] === 'function') {
        mockPlugins[plugin].mockClear();
      }
    }
  });

  describe('default plugins', () => {
    testDefaultPlugin('fakeTextCursorPlugin');
    testDefaultPlugin('submitEditorPlugin');

    it('should add insertBlockPlugin to the editor with insertMenuItems', () => {
      const { insertBlockPlugin } = mockPlugins;
      const customItems = [
        {
          content: 'a',
          value: { name: 'a' },
          tooltipDescription: 'item a',
          tooltipPosition: 'right',
          onClick: () => {},
        },
        {
          content: 'b',
          value: { name: 'b' },
          tooltipDescription: 'item b',
          tooltipPosition: 'right',
          onClick: () => {},
        },
      ];

      const props = {
        insertMenuItems: customItems,
        nativeStatusSupported: false,
      };

      createPluginsList(props);
      expect(insertBlockPlugin).toHaveBeenCalledTimes(1);
      expect(insertBlockPlugin).toHaveBeenCalledWith(props);
    });
  });

  describe('configured plugins', () => {
    testBooleanConfiguredPlugin('helpDialogPlugin', 'allowHelpDialog');
    testBooleanConfiguredPlugin('layoutPlugin', 'allowLayouts');
    testBooleanConfiguredPlugin(
      'historyAnalyticsPlugin',
      'allowAnalyticsGASV3',
    );
    testBooleanConfiguredPlugin('tablesPlugin', 'allowTables');
    testBooleanConfiguredPlugin('analyticsPlugin', 'allowAnalyticsGASV3', [
      createAnalyticsEvent,
    ]);
    testBooleanConfiguredPlugin('statusPlugin', 'allowStatus');

    it('should add statusPlugin if allowStatus prop is provided with menuDisabled true', () => {
      const { statusPlugin, insertBlockPlugin } = mockPlugins;
      createPluginsList({ allowStatus: { menuDisabled: true } });
      expect(statusPlugin).toHaveBeenCalledTimes(1);
      expect(statusPlugin).toHaveBeenCalledWith({ menuDisabled: true });
      expect(insertBlockPlugin).toBeCalledWith(
        expect.objectContaining({ nativeStatusSupported: false }),
      );
    });

    it('should add statusPlugin if allowStatus prop is provided with menuDisabled false', () => {
      const { statusPlugin, insertBlockPlugin } = mockPlugins;
      createPluginsList({ allowStatus: { menuDisabled: false } });
      expect(statusPlugin).toHaveBeenCalledTimes(1);
      expect(statusPlugin).toHaveBeenCalledWith({ menuDisabled: false });
      expect(insertBlockPlugin).toBeCalledWith(
        expect.objectContaining({ nativeStatusSupported: true }),
      );
    });
  });

  it('should add mediaPlugin if media prop is provided', () => {
    const { mediaPlugin } = mockPlugins;
    const media = {
      provider: Promise.resolve() as any,
      allowMediaSingle: true,
    };
    createPluginsList({ media, appearance: 'full-page' });
    expect(mediaPlugin).toHaveBeenCalledTimes(1);
    expect(mediaPlugin).toHaveBeenCalledWith(media, 'full-page');
  });

  it('should add placeholderText plugin if allowTemplatePlaceholders prop is provided', () => {
    const { placeholderTextPlugin } = mockPlugins;
    placeholderTextPlugin.mockReturnValue('placeholderText');
    const plugins = createPluginsList({ allowTemplatePlaceholders: true });
    expect(plugins).toContain('placeholderText');
  });

  it('should pass empty options to placeholderText plugin if allowTemplatePlaceholders is true', () => {
    const { placeholderTextPlugin } = mockPlugins;
    createPluginsList({ allowTemplatePlaceholders: true });
    expect(placeholderTextPlugin).toHaveBeenCalledTimes(1);
    expect(placeholderTextPlugin).toHaveBeenCalledWith({});
  });

  it('should enable allowInserting for placeholderText plugin if options.allowInserting is true', () => {
    const { placeholderTextPlugin } = mockPlugins;
    createPluginsList({ allowTemplatePlaceholders: { allowInserting: true } });
    expect(placeholderTextPlugin).toHaveBeenCalledTimes(1);
    expect(placeholderTextPlugin).toHaveBeenCalledWith({
      allowInserting: true,
    });
  });
});
