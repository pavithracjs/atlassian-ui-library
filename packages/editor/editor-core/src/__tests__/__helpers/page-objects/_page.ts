export async function disableCaretCursor(page) {
  const css = `
  * {
    caret-color: transparent;
  }
  `;
  await page.addStyleTag({ content: css });
}

export async function disableAllTransitions(page) {
  const css = `
  * {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
  }
  `;
  await page.addStyleTag({ content: css });
}

export async function disableAllAnimations(page) {
  const css = `
  * {
    animation: none !important;
  }
  `;
  await page.addStyleTag({ content: css });
}
