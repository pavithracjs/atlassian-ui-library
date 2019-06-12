import {
  getExampleUrl,
  disableAllSideEffects,
  navigateToUrl,
  compareScreenshot,
} from '@atlaskit/visual-regression/helper';
import { EditorProps } from '../../types';
import { Page } from '../__helpers/page-objects/_types';

export {
  setupMediaMocksProviders,
  editable,
  changeSelectedNodeLayout,
  rerenderEditor,
  setFeature,
  toggleFeature,
} from '../integration/_helpers';

export const DEFAULT_WIDTH = 800;
export const DEFAULT_HEIGHT = 600;

export const dynamicTextViewportSizes = [
  { width: 1440, height: 4000 },
  { width: 1280, height: 4000 },
  { width: 768, height: 4000 },
  { width: 1024, height: 4000 },
];

// TODO: remove this gotoExample step
export const initEditor = async (page: any, appearance: string) => {
  const editor = '.ProseMirror';
  const url = getExampleUrl(
    'editor',
    'editor-core',
    appearance,
    // @ts-ignore
    global.__BASEURL__,
  );
  await navigateToUrl(page, url);
  if (appearance === 'comment') {
    const placeholder = 'input[placeholder="What do you want to say?"]';
    await page.waitForSelector(placeholder);
    await page.click(placeholder);
  }

  await page.setViewport({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
  await page.waitForSelector(editor);
  await page.click(editor);
  await page.addStyleTag({
    content: `
      .json-output { display: none; }
      .ProseMirror { caret-color: transparent; }
      .ProseMirror-gapcursor span::after { animation-play-state: paused !important; }
    `,
  });
};

export enum Device {
  Default = 'Default',
  LaptopHiDPI = 'LaptopHiDPI',
  LaptopMDPI = 'LaptopMDPI',
  iPadPro = 'iPadPro',
  iPad = 'iPad',
  iPhonePlus = 'iPhonePlus',
}

export const deviceViewPorts = {
  [Device.Default]: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
  [Device.LaptopHiDPI]: { width: 1440, height: 900 },
  [Device.LaptopMDPI]: { width: 1280, height: 800 },
  [Device.iPadPro]: { width: 1024, height: 1366 },
  [Device.iPad]: { width: 768, height: 1024 },
  [Device.iPhonePlus]: { width: 414, height: 736 },
};

function getEditorProps(appearance: Appearance) {
  const enableAllEditorProps = {
    allowPanel: true,
    allowLists: true,
    allowTextColor: true,
    allowTextAlignment: true,
    quickInsert: true,
    allowCodeBlocks: { enableKeybindingsForIDE: true },
    allowTables: {
      advanced: true,
    },
    allowBreakout: true,
    allowJiraIssue: true,
    allowUnsupportedContent: true,
    allowExtension: {
      allowBreakout: true,
    },
    allowRule: true,
    allowDate: true,
    allowLayouts: {
      allowBreakout: true,
    },
    allowIndentation: true,
    allowTemplatePlaceholders: { allowInserting: true },
    allowStatus: true,
    media: true, // add true here since the testing example would handle providers
    placeholder:
      'Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule.',
    shouldFocus: false,
    UNSAFE_cards: true,
  };

  if (
    appearance === Appearance.fullPage ||
    appearance === Appearance.fullWidth
  ) {
    return {
      ...enableAllEditorProps,
      primaryToolbarComponents: true,
      contentComponents: true,
      media: {
        allowMediaSingle: true,
        allowResizing: true,
        allowMediaGroup: true,
      },
    };
  }

  if (appearance === Appearance.comment) {
    return {
      ...enableAllEditorProps,
      media: {
        allowMediaSingle: false,
        allowMediaGroup: true,
      },
    };
  }

  return enableAllEditorProps;
}

export async function mountEditor(
  page: any,
  props: any,
  mode?: 'light' | 'dark',
) {
  await page.evaluate(
    (props: EditorProps, mode?: 'light' | 'dark') => {
      (window as any).__mountEditor(props, mode);
    },
    props,
    mode,
  );
  await page.waitForSelector('.ProseMirror', 500);
}

export enum Appearance {
  fullWidth = 'full-width',
  fullPage = 'full-page',
  comment = 'comment',
  mobile = 'mobile',
}

type SideEffectsOption = {
  cursor?: boolean;
  animation?: boolean;
  transition?: boolean;
  scroll?: boolean;
};

type InitEditorWithADFOptions = {
  appearance: Appearance;
  adf?: Object;
  device?: Device;
  viewport?: { width: number; height: number };
  editorProps?: EditorProps;
  mode?: 'light' | 'dark';
  allowSideEffects?: SideEffectsOption;
};

export const initEditorWithAdf = async (
  page: any,
  {
    appearance,
    adf = {},
    device = Device.Default,
    viewport,
    editorProps = {},
    mode,
    allowSideEffects = {},
  }: InitEditorWithADFOptions,
) => {
  const url = getExampleUrl('editor', 'editor-core', 'vr-testing');
  await navigateToUrl(page, url);

  // Set the viewport to the right one
  if (viewport) {
    await page.setViewport(viewport);
  } else {
    await page.setViewport(deviceViewPorts[device]);
  }

  // Mount the editor with the right attributes
  await mountEditor(
    page,
    {
      appearance: appearance,
      defaultValue: JSON.stringify(adf),
      ...getEditorProps(appearance),
      ...editorProps,
    },
    mode,
  );

  // We disable possible side effects, like animation, transitions and caret cursor,
  // because we cannot control and affect snapshots
  // You can override this disabling if you are sure that you need it in your test
  await disableAllSideEffects(page, allowSideEffects);
};

export const initFullPageEditorWithAdf = async (
  page: any,
  adf: Object,
  device?: Device,
  viewport?: { width: number; height: number },
  editorProps?: EditorProps,
  mode?: 'light' | 'dark',
  allowSideEffects?: SideEffectsOption,
) => {
  await initEditorWithAdf(page, {
    adf,
    appearance: Appearance.fullPage,
    device,
    viewport,
    editorProps,
    mode,
    allowSideEffects,
  });
};

export const initCommentEditorWithAdf = async (
  page: any,
  adf: Object,
  device?: Device,
) => {
  await initEditorWithAdf(page, {
    adf,
    appearance: Appearance.comment,
    device,
  });
};

/**
 * Updates props of current mounted Editor component
 * Pass in only the new props you wish to apply on top of the current ones
 */
export const updateEditorProps = async (
  page: Page,
  newProps: Partial<EditorProps>,
) => {
  await page.evaluate((props: EditorProps) => {
    (window as any).__updateEditorProps(props);
  }, newProps);
};

export const clearEditor = async (page: any) => {
  await page.evaluate(() => {
    const dom = document.querySelector('.ProseMirror') as HTMLElement;
    dom.innerHTML = '<p><br /></p>';
  });
};

export const snapshot = async (
  page: Page,
  threshold: {
    tolerance?: number;
    useUnsafeThreshold?: boolean;
  } = {},
  selector: string = '.akEditor',
) => {
  const { tolerance, useUnsafeThreshold } = threshold;
  const editor = await page.$(selector);

  // Try to take a screenshot of only the editor.
  // Otherwise take the whole page.
  let image;
  if (editor) {
    image = await editor.screenshot();
  } else {
    image = await page.screenshot();
  }

  compareScreenshot(image, tolerance, { useUnsafeThreshold });
};
