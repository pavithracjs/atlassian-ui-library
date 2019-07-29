import { Plugin, Transaction, PluginKey } from 'prosemirror-state';
import { browser } from '@atlaskit/editor-common';

export const pluginKey = new PluginKey('iosScrolling');

export function setKeyboardControlsHeight(
  tr: Transaction,
  height = 0,
  dispatch: Function,
): void {
  dispatch(tr.setMeta(pluginKey, height));
}

function onViewportResize(e: Event) {}

// Per Apple's UX design guidelines. 44 pixels squared is the minimum size for a tap target.
const MIN_TAP_SIZE_PX = 44;

// Default values suitable when using an external hardware keyboard.
const DEFAULT_SCROLL_THRESHOLD = MIN_TAP_SIZE_PX * 3;
const DEFAULT_SCROLL_MARGIN = DEFAULT_SCROLL_THRESHOLD;

/**
 * iOS 11+ WebView Scrolling
 *
 * When the on screen keyboard (OSK) is visible, it sits above the page content.
 * The browser doesn't inform the web view when the OSK is raised or dismissed.
 * The default scrolling logic within ProseMirror (using `scrollIntoView`) is
 * calculated using the viewport height. It has no context about the soft keyboard.
 *
 * To improve the user experience, we adjust the scrolling values to effectively
 * keep the user's selection in the top half of the screen (above the OSK).
 * This avoids the user's selection going underneath the keyboard in the majority
 * of situations.
 *
 * In contrast, legacy iOS versions, and Android resize the viewport when the OSK
 * is toggled, which allows the default scrolling to function correctly.
 */
const plugin = new Plugin({
  key: pluginKey,
  props: {
    // Determines the distance (in pixels) between the cursor and the end of the visible viewport at which point,
    // when scrolling the cursor into view, scrolling takes place.
    // Defaults to 0: https://prosemirror.net/docs/ref/#view.EditorProps.scrollThreshold
    scrollThreshold: DEFAULT_SCROLL_THRESHOLD,
    // Determines the extra space (in pixels) that is left above or below the cursor when it is scrolled into view.
    // Defaults to 5: https://prosemirror.net/docs/ref/#view.EditorProps.scrollMargin
    // scrollMargin: 300,
    scrollMargin: DEFAULT_SCROLL_MARGIN,
  },
  state: {
    init(): number {
      window.addEventListener('resize', onViewportResize, false);
      return 0;
    },
    apply(tr: Transaction, value: number): number {
      const newKeyboardControlsHeight = parseInt(tr.getMeta(pluginKey));
      if (newKeyboardControlsHeight >= 0) {
        const viewportHeight = ((window as any).viewportHeight =
          document.documentElement.scrollHeight);
        const controlsHeight = ((window as any).controlsHeight = newKeyboardControlsHeight); //parseInt(newKeyboardControlsHeight);
        const contentVisibleHeight = ((window as any).contentVisibleHeight =
          viewportHeight - controlsHeight);

        const scrollMargin = contentVisibleHeight - MIN_TAP_SIZE_PX * 2;
        const scrollThreshold = contentVisibleHeight;
        // ProseMirror uses the reference to this object when calculating its internal scroll offsets
        // By mutating the values stored in the props, we're able to dynamically update them.
        (this as any).props.scrollThreshold = scrollThreshold;
        (this as any).props.scrollMargin = scrollMargin;

        // TODO: Find and store the result once for later reuse...
        const editor = document.querySelector('.ProseMirror') as HTMLElement;
        // Resize the editor to fill the viewport (relative to controls)
        // Allows focusing the editor when tapping whitespace if the content doesn't yet exceed the viewport.
        editor.style.minHeight = `calc(100vh - ${controlsHeight}px)`;
        editor.style.backgroundColor = 'red';
        return controlsHeight;
      }
      return value;
    },
  },
});

export default () => {
  if (browser.ios) {
    (window as any).iosScrollPlugin = plugin;
    (window as any).setKeyboardControlsHeight = setKeyboardControlsHeight;
    return plugin;
  }
  return undefined;
};
