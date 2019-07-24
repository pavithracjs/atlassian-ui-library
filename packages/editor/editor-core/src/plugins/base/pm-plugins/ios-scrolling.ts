import { Plugin } from 'prosemirror-state';
import { browser } from '@atlaskit/editor-common';

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
export default () => {
  if (browser.ios) {
    return new Plugin({
      props: {
        // Determines the distance (in pixels) between the cursor and the end of the visible viewport at which point,
        // when scrolling the cursor into view, scrolling takes place.
        // Defaults to 0: https://prosemirror.net/docs/ref/#view.EditorProps.scrollThreshold
        scrollThreshold: 400,
        // Determines the extra space (in pixels) that is left above or below the cursor when it is scrolled into view.
        // Defaults to 5: https://prosemirror.net/docs/ref/#view.EditorProps.scrollMargin
        scrollMargin: 300,
      },
    });
  }
  return undefined;
};
