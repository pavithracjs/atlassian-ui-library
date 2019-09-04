import * as React from 'react';
import Item from '@atlaskit/item';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji';
import { emoji as emojiData } from '@atlaskit/util-data-test';
import {
  doc,
  p,
  createEditorFactory,
  decisionList,
  decisionItem,
  taskList,
  taskItem,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';
import { taskDecision } from '@atlaskit/util-data-test';
import { ProviderFactory } from '@atlaskit/editor-common';
import { uuid } from '@atlaskit/adf-schema';
import Button from '@atlaskit/button';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import { pluginKey as blockTypePluginKey } from '../../../../../plugins/block-type/pm-plugins/main';
import {
  messages as blockTypeMessages,
  CODE_BLOCK,
  PANEL,
  BLOCK_QUOTE,
} from '../../../../../plugins/block-type/types';
import DropdownMenu from '../../../../../ui/DropdownMenu';
import ToolbarInsertBlock, {
  messages,
  Props as ToolbarInsertBlockProps,
} from '../../../../../plugins/insert-block/ui/ToolbarInsertBlock';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import { MediaProvider } from '../../../../../plugins/media';
import {
  stateKey as hyperlinkPluginKey,
  LinkAction,
} from '../../../../../plugins/hyperlink/pm-plugins/main';
import {
  INPUT_METHOD,
  DispatchAnalyticsEvent,
} from '../../../../../plugins/analytics';
import { AnalyticsHandler } from '../../../../../analytics';
import { ReactWrapper, mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import { InsertMenuCustomItem } from '../../../../../types';
import { TooltipShortcut } from '../../../../../keymaps';
import { InjectedIntlProps } from 'react-intl';

type ToolbarOptionWrapper = ReactWrapper<
  ToolbarInsertBlockProps & InjectedIntlProps
>;

const emojiProvider = emojiData.testData.getEmojiResourcePromise();

const mediaProvider: Promise<MediaProvider> = Promise.resolve({
  viewMediaClientConfig: {} as any,
  uploadMediaClientConfig: {} as any,
});

const providerFactory = ProviderFactory.create({ mediaProvider });

const openInsertMenu = (toolbarOption: ToolbarOptionWrapper) => {
  toolbarOption.find('button').simulate('click');
};

const getToolbarButton = (
  title: string,
  toolbarOption: ToolbarOptionWrapper,
): ReactWrapper =>
  toolbarOption
    .find(ToolbarButton)
    .filterWhere(
      toolbarButton => toolbarButton.find('Icon').prop('label') === title,
    )
    .find(Button);

const getInsertMenuButton = (
  title: string,
  toolbarOption: ToolbarOptionWrapper,
) => {
  openInsertMenu(toolbarOption);
  return toolbarOption
    .find<any>(Item)
    .filterWhere(n => n.text().indexOf(title) > -1);
};

const clickToolbarButton = (
  title: string,
  toolbarOption: ToolbarOptionWrapper,
) => {
  getToolbarButton(title, toolbarOption).simulate('click');
};

const clickInsertMenuOption = (
  title: string,
  toolbarOption: ToolbarOptionWrapper,
) => {
  getInsertMenuButton(title, toolbarOption).simulate('click');
};

const menus = [
  {
    name: INPUT_METHOD.TOOLBAR,
    numButtons: 1,
    getButton: getToolbarButton,
    clickButton: clickToolbarButton,
  },
  {
    name: INPUT_METHOD.INSERT_MENU,
    numButtons: 0,
    getButton: getInsertMenuButton,
    clickButton: clickInsertMenuOption,
  },
];

describe('@atlaskit/editor-core/ui/ToolbarInsertBlock', () => {
  const createEditor = createEditorFactory();
  let editorView: EditorView;
  let pluginState: any;
  let toolbarOption: ToolbarOptionWrapper;
  let analyticsHandlerSpy: jest.Mock<AnalyticsHandler>;
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let dispatchAnalyticsSpy: jest.SpyInstance<DispatchAnalyticsEvent>;
  let dispatchSpy: jest.SpyInstance;

  const editor = (doc: any) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      pluginKey: blockTypePluginKey,
      editorProps: {
        analyticsHandler: analyticsHandlerSpy,
        allowCodeBlocks: true,
        allowLayouts: true,
        allowLists: true,
        allowPanel: true,
        allowRule: true,
        allowTables: true,
        allowStatus: true,
        allowAnalyticsGASV3: true,
        taskDecisionProvider: Promise.resolve(
          taskDecision.getMockTaskDecisionResource(),
        ),
      },
      providerFactory,
      createAnalyticsEvent,
    });
  };

  const buildToolbar = (props: Partial<ToolbarInsertBlockProps> = {}) => {
    let defaultProps = {
      editorView,
      isReducedSpacing: false,
      buttons: 0,
      dispatchAnalyticsEvent: dispatchAnalyticsSpy as any,
    };
    toolbarOption = mountWithIntl<ToolbarInsertBlockProps, {}>(
      <ToolbarInsertBlock {...defaultProps} {...props} />,
    );
  };

  beforeEach(() => {
    dispatchAnalyticsSpy = jest.fn();
    analyticsHandlerSpy = jest.fn();
    ({ editorView, pluginState } = editor(doc(p('text'))));
    dispatchSpy = jest.spyOn(editorView, 'dispatch');
  });

  afterEach(() => {
    if (toolbarOption) {
      toolbarOption.unmount();
    }
  });

  it('should render nothing if none of the plugins are present', () => {
    buildToolbar();
    expect(toolbarOption.html()).toEqual(null);
  });

  it('should disable toolbar buttons if isDisabled is true', () => {
    buildToolbar({
      isDisabled: true,
      availableWrapperBlockTypes: pluginState.availableWrapperBlockTypes,
    });
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
  });

  describe('tooltip with shortcut', () => {
    [
      { toolbarProps: { mentionsSupported: true }, result: '/' },
      {
        toolbarProps: { tableSupported: true, buttons: 2 },
        result: 'Shift+Alt+T',
      },
    ].forEach(({ toolbarProps, result }) => {
      describe('render the tooltip with shortcut', () => {
        let tooltipContent: ReactWrapper;

        beforeEach(() => {
          buildToolbar(toolbarProps);
          tooltipContent = mount(
            <div>
              {toolbarOption
                .find(ToolbarButton)
                .first()
                .prop('title')}
            </div>,
          );
        });

        afterEach(() => {
          if (tooltipContent) {
            tooltipContent.unmount();
          }
        });

        it(`the shortcut ${result} is displayed with a background`, () => {
          expect(tooltipContent.find(TooltipShortcut).text()).toEqual(result);
        });
      });
    });
  });

  describe('custom items', () => {
    let customItems: InsertMenuCustomItem[];

    beforeEach(() => {
      customItems = [
        {
          content: 'Custom A',
          value: { name: 'custom-a' },
          onClick: jest.fn(),
        },
        {
          content: 'Custom B',
          value: { name: 'custom-b' },
          onClick: jest.fn(),
        },
      ];

      buildToolbar({ insertMenuItems: customItems });
    });

    it('should add custom items to the insert menu', () => {
      const items = toolbarOption.find(DropdownMenu).prop('items')[0];
      expect(items.items.length).toEqual(customItems.length);
    });

    it("should call custom item's onClick callback when it is clicked in menu", () => {
      const onItemActivated = toolbarOption
        .find(DropdownMenu)
        .prop('onItemActivated');

      onItemActivated!.call(
        { props: { insertMenuItems: customItems } },
        { item: customItems[0] },
      );

      expect(customItems[0].onClick).toHaveBeenCalled();
    });
  });

  menus.forEach(menu => {
    describe(`for menu type ${menu.name}`, () => {
      const buildToolbarForMenu = (props: Partial<ToolbarInsertBlockProps>) =>
        buildToolbar({ buttons: menu.numButtons, ...props });

      describe('click emoji option', () => {
        const clickEmojiOption = () => {
          menu.clickButton(messages.emoji.defaultMessage, toolbarOption);
        };

        beforeEach(() => {
          buildToolbarForMenu({
            emojiDisabled: false,
            isTypeAheadAllowed: true,
            emojiProvider,
          });
          clickEmojiOption();
        });

        it('should open emoji picker', () => {
          expect(toolbarOption.find(AkEmojiPicker).exists()).toBe(true);
        });

        it('should close emoji picker when emoji option is clicked again', () => {
          if (menu.name === INPUT_METHOD.TOOLBAR) {
            clickEmojiOption();
          } else {
            openInsertMenu(toolbarOption);
          }
          expect(toolbarOption.find(AkEmojiPicker).exists()).toBe(false);
        });

        it('should fire analytics event when emoji picker opened', () => {
          expect(dispatchAnalyticsSpy).toHaveBeenCalledWith({
            action: 'opened',
            actionSubject: 'picker',
            actionSubjectId: 'emojiPicker',
            attributes: { inputMethod: menu.name },
            eventType: 'ui',
          });
        });
      });

      describe('mentions option', () => {
        // Following test case is breaking due to trouble in @atlaskit/downdown.
        // isDisabled is always set to false.
        it.skip('should disable button if mentionsEnabled is false', () => {
          buildToolbarForMenu({
            mentionsSupported: true,
            isTypeAheadAllowed: true,
            mentionsEnabled: false,
          });
          const mentionButton = menu.getButton(
            messages.mention.defaultMessage,
            toolbarOption,
          );
          expect(mentionButton.prop('isDisabled')).toEqual(true);
        });

        it('should fire v3 analytics event when mention option clicked', () => {
          buildToolbarForMenu({
            mentionsSupported: true,
            isTypeAheadAllowed: true,
            mentionsEnabled: true,
          });
          menu.clickButton(messages.mention.defaultMessage, toolbarOption);
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'invoked',
            actionSubject: 'typeAhead',
            actionSubjectId: 'mentionTypeAhead',
            attributes: { inputMethod: menu.name },
            eventType: 'ui',
          });
        });
      });

      describe('click media option', () => {
        let onShowMediaPickerSpy = jest.fn();

        beforeEach(() => {
          buildToolbarForMenu({
            mediaSupported: true,
            mediaUploadsEnabled: true,
            onShowMediaPicker: onShowMediaPickerSpy,
          });
          menu.clickButton(
            messages.filesAndImages.defaultMessage,
            toolbarOption,
          );
        });

        it('should call onShowMediaPicker', () => {
          expect(onShowMediaPickerSpy).toHaveBeenCalledTimes(1);
        });

        it('should fire v2 analytics event', () => {
          expect(analyticsHandlerSpy).toHaveBeenCalledWith(
            'atlassian.editor.format.media.button',
          );
        });

        it('should fire v3 analytics event', () => {
          expect(dispatchAnalyticsSpy).toHaveBeenCalledWith({
            action: 'opened',
            actionSubject: 'picker',
            actionSubjectId: 'cloudPicker',
            attributes: { inputMethod: menu.name },
            eventType: 'ui',
          });
        });
      });

      describe('click link option', () => {
        beforeEach(() => {
          buildToolbarForMenu({ linkSupported: true });
          menu.clickButton(messages.link.defaultMessage, toolbarOption);
        });

        it('should insert link', () => {
          const linkMeta = dispatchSpy.mock.calls[0][0].getMeta(
            hyperlinkPluginKey,
          );
          expect(linkMeta.type).toEqual(LinkAction.SHOW_INSERT_TOOLBAR);
          dispatchSpy.mockRestore();
        });

        it('should fire analytics event', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'invoked',
            actionSubject: 'typeAhead',
            actionSubjectId: 'linkTypeAhead',
            attributes: { inputMethod: menu.name },
            eventType: 'ui',
          });
        });
      });

      describe('click rule option', () => {
        it('should fire v3 analytics event', () => {
          buildToolbarForMenu({ horizontalRuleEnabled: true });
          menu.clickButton(
            messages.horizontalRule.defaultMessage,
            toolbarOption,
          );

          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'divider',
            attributes: { inputMethod: menu.name },
            eventType: 'track',
          });
        });
      });

      describe('click table option', () => {
        beforeEach(() => {
          ({ editorView } = editor(doc(p('text'))));
          buildToolbarForMenu({ tableSupported: true });
          menu.clickButton(messages.table.defaultMessage, toolbarOption);
        });

        it('should fire v2 analytics event', () => {
          expect(analyticsHandlerSpy).toHaveBeenCalledWith(
            'atlassian.editor.format.table.button',
          );
        });

        it('should fire v3 analytics event', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'table',
            attributes: { inputMethod: menu.name },
            eventType: 'track',
          });
        });
      });

      describe('click action option', () => {
        beforeEach(() => {
          uuid.setStatic('local-highlight');
          buildToolbarForMenu({ actionSupported: true });
          menu.clickButton(messages.action.defaultMessage, toolbarOption);
        });

        afterEach(() => {
          uuid.setStatic(false);
        });

        it('should insert action', () => {
          expect(editorView.state.doc).toEqualDocument(
            doc(
              taskList({ localId: 'local-highlight' })(
                taskItem({ localId: 'local-highlight', state: 'TODO' })('text'),
              ),
            ),
          );
        });

        it('should fire v2 analytics event', () => {
          expect(analyticsHandlerSpy).toHaveBeenCalledWith(
            'atlassian.fabric.action.trigger.button',
          );
        });

        it('should fire v3 analytics event', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'action',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'track',
          });
        });
      });

      describe('click decision option', () => {
        beforeEach(() => {
          uuid.setStatic('local-highlight');
          buildToolbarForMenu({ decisionSupported: true });
          menu.clickButton(messages.decision.defaultMessage, toolbarOption);
        });

        afterEach(() => {
          uuid.setStatic(false);
        });

        it('should insert decision', () => {
          expect(editorView.state.doc).toEqualDocument(
            doc(
              decisionList({ localId: 'local-highlight' })(
                decisionItem({ localId: 'local-highlight' })('text'),
              ),
            ),
          );
        });

        it('should fire v2 analytics event', () => {
          expect(analyticsHandlerSpy).toHaveBeenCalledWith(
            'atlassian.fabric.decision.trigger.button',
          );
        });

        it('should fire v3 analytics event', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'decision',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'track',
          });
        });
      });

      describe('click macro option', () => {
        let insertMacroFromMacroBrowserSpy: jest.Mock;

        beforeEach(() => {
          insertMacroFromMacroBrowserSpy = jest.fn();
          buildToolbarForMenu({
            macroProvider: {} as any,
            onInsertMacroFromMacroBrowser: () => insertMacroFromMacroBrowserSpy,
          });
          menu.clickButton(messages.viewMore.defaultMessage, toolbarOption);
        });

        it('should insert macro', () => {
          expect(insertMacroFromMacroBrowserSpy).toHaveBeenCalled();
        });

        it('should fire v2 analytics event', () => {
          expect(analyticsHandlerSpy).toHaveBeenCalledWith(
            'atlassian.editor.format.macro.button',
          );
        });
      });

      describe('click placeholder option', () => {
        beforeEach(() => {
          buildToolbarForMenu({ placeholderTextEnabled: true });
          menu.clickButton(
            messages.placeholderText.defaultMessage,
            toolbarOption,
          );
        });

        it('should fire v2 analytics event', () => {
          expect(analyticsHandlerSpy).toHaveBeenCalledWith(
            'atlassian.editor.format.placeholder.button',
          );
        });
      });

      describe('click columns option', () => {
        beforeEach(() => {
          buildToolbarForMenu({ layoutSectionEnabled: true });
          menu.clickButton(messages.columns.defaultMessage, toolbarOption);
        });

        it('should fire v2 analytics event', () => {
          expect(analyticsHandlerSpy).toHaveBeenCalledWith(
            'atlassian.editor.format.layout.button',
          );
        });

        it('should fire v3 analytics event', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'layout',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'track',
          });
        });
      });

      describe('click status option', () => {
        beforeEach(() => {
          buildToolbarForMenu({ nativeStatusSupported: true });
          menu.clickButton(messages.status.defaultMessage, toolbarOption);
        });

        it('should fire v3 analytics event', () => {
          expect(createAnalyticsEvent).toHaveBeenCalledWith({
            action: 'inserted',
            actionSubject: 'document',
            actionSubjectId: 'status',
            attributes: expect.objectContaining({ inputMethod: menu.name }),
            eventType: 'track',
          });
        });
      });

      const blockTypes = [
        {
          type: PANEL,
          title: blockTypeMessages.infoPanel.defaultMessage,
        },
        {
          type: CODE_BLOCK,
          title: blockTypeMessages.codeblock.defaultMessage,
        },
        {
          type: BLOCK_QUOTE,
          title: blockTypeMessages.blockquote.defaultMessage,
        },
      ];
      blockTypes.forEach(blockType => {
        const { type, title } = blockType;
        describe(`click ${type.name} option`, () => {
          let insertBlockTypeSpy: jest.Mock;

          beforeEach(() => {
            insertBlockTypeSpy = jest.fn(() => () => true);
            buildToolbarForMenu({
              availableWrapperBlockTypes: [type],
              onInsertBlockType: insertBlockTypeSpy,
            });
            menu.clickButton(title, toolbarOption);
          });

          it('should call insertBlockType', () => {
            expect(insertBlockTypeSpy).toHaveBeenCalledTimes(1);
            expect(insertBlockTypeSpy).toHaveBeenCalledWith(type.name);
          });

          it('should fire v2 analytics event', () => {
            expect(analyticsHandlerSpy).toHaveBeenCalledWith(
              `atlassian.editor.format.${type.name}.button`,
            );
          });
        });
      });
    });
  });
});
