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
  if (!allowSideEffects.fonts) {
    await disableDefaultSystemFonts(page);
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

async function disableDefaultSystemFonts(page /*: any */) {
  // Standardise the font used in VR for more consistent results between operating systems.
  // Due to font rendering engine differences, it's impossible to get cross platform pixel
  // perfect comparisons.
  // Always generate snapshot images from a Docker image for consistent results.
  const css = `
    body {
      font-family: 'Open Sans', sans-serif;
    }
  `;
  await page.addStyleTag({
    url: 'https://fonts.googleapis.com/css?family=Open+Sans',
  });
  await page.addStyleTag({ content: css });
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
  takeScreenShot,
  takeElementScreenShot,
  getExampleUrl,
  disableAllAnimations,
  disableAllTransitions,
  disableCaretCursor,
  disableScrollBehavior,
  disableAllSideEffects,
};
