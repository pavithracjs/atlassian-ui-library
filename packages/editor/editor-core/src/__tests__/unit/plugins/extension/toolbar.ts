import {
  createEditorFactory,
  doc,
  extension,
  activityProviderFactory,
} from '@atlaskit/editor-test-helpers';
import { IntlProvider } from 'react-intl';
import { ProviderFactory } from '@atlaskit/editor-common';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import { pluginKey } from '../../../../plugins/extension/plugin';

import { getToolbarConfig } from '../../../../plugins/extension/toolbar';
import commonMessages from '../../../../messages';
import { EditorProps } from '../../../../types';
import { getToolbarItems } from '../floating-toolbar/_helpers';

describe('extension toolbar', () => {
  const createEditor = createEditorFactory();
  const providerFactory = ProviderFactory.create({
    activityProvider: activityProviderFactory([]),
  });

  const editor = (doc: any, props: Partial<EditorProps> = {}) => {
    return createEditor({
      doc,
      editorProps: {
        appearance: 'full-page',
        allowBreakout: true,
        allowExtension: {
          allowBreakout: true,
        },
        ...props,
      },
      pluginKey,
    });
  };

  describe('toolbar', () => {
    const intlProvider = new IntlProvider({ locale: 'en' });
    const { intl } = intlProvider.getChildContext();

    const defaultBreakoutTitle = intl.formatMessage(
      commonMessages.layoutFixedWidth,
    );
    const wideBreakoutTitle = intl.formatMessage(commonMessages.layoutWide);
    const fullWidthBreakoutTitle = intl.formatMessage(
      commonMessages.layoutFullWidth,
    );
    const removeTitle = intl.formatMessage(commonMessages.remove);

    it('has a remove button', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          extension({ extensionKey: 'key', extensionType: 'type' })(),
        ),
      );

      const toolbar = getToolbarConfig()(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();
      const removeButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === removeTitle,
      );

      expect(removeButton).toBeDefined();
      expect(removeButton).toMatchObject({
        appearance: 'danger',
        icon: RemoveIcon,
      });
    });

    it('has an edit button', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          extension({ extensionKey: 'key', extensionType: 'type' })(),
        ),
      );

      const toolbar = getToolbarConfig()(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();
      const editButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === 'Edit',
      );

      expect(editButton).toBeDefined();
      expect(editButton).toMatchObject({
        icon: EditIcon,
      });
    });

    it('has breakout buttons', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          extension({ extensionKey: 'key', extensionType: 'type' })(),
        ),
      );

      const toolbar = getToolbarConfig(true)(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();
      const breakoutButtons = getToolbarItems(toolbar!, editorView).filter(
        item =>
          item.type === 'button' &&
          [
            defaultBreakoutTitle,
            wideBreakoutTitle,
            fullWidthBreakoutTitle,
          ].indexOf(item.title) > -1,
      );

      expect(breakoutButtons).toBeDefined();
      expect(breakoutButtons).toHaveLength(3);
    });

    it('has no breakout buttons when breakout is disabled', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          extension({ extensionKey: 'key', extensionType: 'type' })(),
        ),
      );

      const toolbar = getToolbarConfig(false)(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();
      const breakoutButtons = getToolbarItems(toolbar!, editorView).filter(
        item =>
          item.type === 'button' &&
          [
            defaultBreakoutTitle,
            wideBreakoutTitle,
            fullWidthBreakoutTitle,
          ].indexOf(item.title) > -1,
      );

      expect(breakoutButtons).toBeDefined();
      expect(breakoutButtons).toHaveLength(0);
    });
  });
});
