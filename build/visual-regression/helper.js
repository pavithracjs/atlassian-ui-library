//@flow
'use strict';
/*
 * Visual-regression snapshot test helper with util functions to do
 * all the things ;)
 */

const glob = require('glob');
const pageSelector = '#examples';

async function disableAllSideEffects(
  page /*: any */,
  allowSideEffects /*: Object */ = {},
) {
  if (!allowSideEffects.cursor) {
    await disableCaretCursor(page);
  }
  if (!allowSideEffects.animation) {
    await disableAllAnimations(page);
  }
  if (!allowSideEffects.transition) {
    await disableAllTransitions(page);
  }
  if (!allowSideEffects.scroll) {
    await disableScrollBehavior(page);
  }
}

async function disableCaretCursor(page /*: any */) {
  const css = `
  * {
    caret-color: transparent;
  }
  `;
  await page.addStyleTag({ content: css });
}

async function disableAllTransitions(page /*: any */) {
  const css = `
  *, *:after, *:before {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
  }
  `;
  await page.addStyleTag({ content: css });
}

async function disableAllAnimations(page /*: any */) {
  const css = `
  *, *:after, *:before {
    animation: none !important;
  }
  `;
  await page.addStyleTag({ content: css });
}

async function disableScrollBehavior(page /*: any */) {
  const css = `
  * {
    scroll-behavior: auto !important;
  }
  `;
  await page.addStyleTag({ content: css });
}

/**
 * Image Loading Helpers
 *
 * We use `page.goto(url, { waitUntil: 'networkidle0' })` which waits for network requests on initial page
 * load to complete.
 *
 * If your example loads content after initial page load (e.g. `waitUntil: 'networkidle0'` isn't sufficient),
 * you can use `waitForLoadedImageElements` or `waitForLoadedBackgroundImages` to wait for all the images
 * on the page to load prior to taking a screenshot.
 */

// Wait for all image elements on the page to have loaded.
function areAllImageElementsLoaded() {
  const images = Array.from(document.images);
  if (!images.length) {
    throw new Error(`
      'waitForLoadedImageElements' was used, but no images existed on the page within the time threshold.
      Ensure the page contains images.
      You can increase the wait time via the 'mediaDelayMs' parameter.
    `);
  }
  return images.every(i => i.complete);
}

/**
 * Wait for resolved image elements to have all loaded.
 *
 * Ensure any `<img />` element's on the page have finished loading their `src` URI.
 *
 * Note: this won't help for Media items which are unresolved (e.g. due to authentication
 * or a media id mismatch) as those scenarios don't render an `<img />`.
 */
async function waitForLoadedImageElements(
  page /*:any*/,
  timeout /*:number*/,
  mediaDelayMs /*:number*/ = 150,
) {
  // Wait for Media API to resolve urls
  await page.waitFor(mediaDelayMs);
  // polling at 50ms (roughly every 3 rendered frames)
  return await page.waitForFunction(areAllImageElementsLoaded, {
    polling: 50,
    timeout,
  });
}

/**
 * Wait for images loaded via the CSS background-image property.
 *
 * Ensure elements using a `background-image` have finished loading their `url`.
 */
async function waitForLoadedBackgroundImages(
  page /*:any*/,
  rootSelector /*:string*/ = '*',
  timeoutMs /*:number*/ = 30000,
) {
  return await page
    .evaluate(
      (selector /*:string*/, raceTimeout /*:number*/) => {
        const urlSrcRegex = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i;
        const bgImageUrlSet = Array.from(
          document.querySelectorAll(selector),
        ).reduce(
          (collection, node) => {
            let prop = window
              .getComputedStyle(node, null)
              .getPropertyValue('background-image');
            // Find elements which have a bg image set
            let match = urlSrcRegex.exec(prop);
            if (match) {
              collection.add(match[1]);
            }
            return collection;
          },
          // Using a Set for automatic de-duplication
          new Set(),
        );
        // Wait for images to load, or abort if timeout threshold is exceeded
        return Promise.race([
          new Promise((resolve, reject) => setTimeout(reject, raceTimeout)),
          Promise.all(
            [...bgImageUrlSet].map(
              url =>
                new Promise((resolve, reject) => {
                  const img = new Image();
                  img.onload = () => resolve({ url, loaded: true });
                  img.onerror = () => reject({ url, loaded: false });
                  img.src = url;
                }),
            ),
          ),
        ]);
      },
      rootSelector,
      timeoutMs,
    )
    .catch(e => {
      console.warn(
        `waitForLoadedBackgroundImages: Failed to resolve background images within the threshold of ${timeoutMs} milliseconds`,
      );
    });
}

async function takeScreenShot(page /*:any*/, url /*:string*/) {
  await page.goto(url, { waitUntil: 'networkidle0' });
  await disableAllAnimations(page);
  await disableAllTransitions(page);
  await disableCaretCursor(page);
  await page.waitForSelector(pageSelector);

  return page.screenshot();
}

async function takeElementScreenShot(page /*:any*/, selector /*:string*/) {
  let element = await page.$(selector);
  return element.screenshot();
}

/**
 * Load Example Url
 *
 * Useful if a package leverages another package's example and you wish to validate
 * that it's available.
 */
async function loadExampleUrl(
  page /*:any*/,
  url /*:string*/,
  reuseExistingSession /*:boolean*/ = true,
) {
  if (reuseExistingSession) {
    const currentUrl /*:string*/ = await page.url();
    if (currentUrl === url) return;
  }
  await page.goto(url, { waitUntil: 'networkidle0' });
  const errorMessage = await validateExampleLoaded(page);

  if (errorMessage) {
    // Throw to fail the test up front instead of waiting for a selector timeout.
    throw new Error(
      `${errorMessage}. Page loaded with unexpected content: ${url}`,
    );
  }
}

// If the required example isn't available, the page resolves with either
// an inline error message, or as empty content.
// Here we check for both scenarios and if discovered we return an error message.
async function validateExampleLoaded(page /*:any*/) {
  return await page.evaluate(() => {
    const doc = document /* as any*/;
    const renderedContent = doc.querySelector('#examples > div:first-child');
    if (renderedContent && !renderedContent.children.length) {
      const message = renderedContent.innerText || '';
      if (~message.indexOf('does not have an example built for'))
        return `This example isn't available`;
    }
    if (!renderedContent) return `Examples page error`;
    // It's assumed the example loaded correctly
    return '';
  });
}

// get all examples from the code sync
function getAllExamplesSync() /*: Array<Object> */ {
  return glob
    .sync('**/packages/**/examples/*.+(js|ts|tsx)', {
      ignore: '**/node_modules/**',
    })
    .map(file => {
      const reverseExamplePath = file.split('/').reverse();
      return {
        team: reverseExamplePath[3],
        package: reverseExamplePath[2],
        exampleName: reverseExamplePath[0]
          .replace('.js', '')
          .replace('.tsx', '')
          .replace(/^\d+\-\s*/, ''),
      };
    });
}

function getExamplesFor(pkgName /*: string */) /*: Array<Object> */ {
  return getAllExamplesSync().filter(obj => obj.package === pkgName);
}

// construct example urls for a given example
const getExampleUrl = (
  group: string,
  packageName: string,
  exampleName: string = '',
  environment: string = global.__BASEURL__,
) =>
  `${environment}/examples.html?groupId=${group}&packageId=${packageName}&exampleId=${exampleName}`;

module.exports = {
  getExamplesFor,
  waitForLoadedImageElements,
  waitForLoadedBackgroundImages,
  takeScreenShot,
  takeElementScreenShot,
  getExampleUrl,
  loadExampleUrl,
  disableAllAnimations,
  disableAllTransitions,
  disableCaretCursor,
  disableScrollBehavior,
  disableAllSideEffects,
  pageSelector,
};
