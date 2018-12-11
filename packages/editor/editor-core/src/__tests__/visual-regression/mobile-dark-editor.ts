import { initEditor, snapshot } from './_utils';

describe('Snapshot Test: Mobile Dark Editor', () => {
  let page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditor(page, 'dark-mobile');
  });

  it('should correctly render dark mode in mobile editor', async () => {
    await snapshot(page);
  });
});
