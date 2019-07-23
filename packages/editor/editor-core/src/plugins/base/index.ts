import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { doc, paragraph, text } from '@atlaskit/adf-schema';
import { EditorPlugin, PMPluginFactory } from '../../types';
import filterStepsPlugin from './pm-plugins/filter-steps';
import focusHandlerPlugin from './pm-plugins/focus-handler';
import newlinePreserveMarksPlugin from './pm-plugins/newline-preserve-marks';
import inlineCursorTargetPlugin from './pm-plugins/inline-cursor-target';
import { plugin as reactNodeView } from './pm-plugins/react-nodeview';
import decorationPlugin from './pm-plugins/decoration';
import scrollGutter from './pm-plugins/scroll-gutter';
import { keymap } from '../../utils/keymap';

interface BasePluginOptions {
  allowScrollGutter?: boolean;
  allowInlineCursorTarget?: boolean;
}

const basePlugin = (options?: BasePluginOptions): EditorPlugin => ({
  pmPlugins() {
    const plugins: { name: string; plugin: PMPluginFactory }[] = [
      {
        name: 'filterStepsPlugin',
        plugin: () => filterStepsPlugin(),
      },
      {
        name: 'inlineCursorTargetPlugin',
        plugin: () =>
          options && options.allowInlineCursorTarget
            ? inlineCursorTargetPlugin()
            : undefined,
      },
      {
        name: 'focusHandlerPlugin',
        plugin: ({ dispatch }) => focusHandlerPlugin(dispatch),
      },
      {
        name: 'newlinePreserveMarksPlugin',
        plugin: newlinePreserveMarksPlugin,
      },
      { name: 'reactNodeView', plugin: () => reactNodeView },
      { name: 'decorationPlugin', plugin: () => decorationPlugin() },
      { name: 'history', plugin: () => history() },
      // should be last :(
      {
        name: 'codeBlockIndent',
        plugin: () =>
          keymap({
            ...baseKeymap,
            'Mod-[': () => true,
            'Mod-]': () => true,
          }),
      },
    ];

    if (options && options.allowScrollGutter) {
      plugins.push({
        name: 'scrollGutterPlugin',
        plugin: () => scrollGutter(),
      });
    }

    return plugins;
  },
  nodes() {
    return [
      { name: 'doc', node: doc },
      { name: 'paragraph', node: paragraph },
      { name: 'text', node: text },
    ];
  },
});

export default basePlugin;
