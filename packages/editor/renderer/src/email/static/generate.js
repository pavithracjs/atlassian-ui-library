// @flow
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const { render } = require('svgexport');
const { resolve } = require('path');
const { writeFileSync, readFileSync } = require('fs');

// This script converts svgs from the the core/icons module
// in to png as base64 data URIs so we can embed them in
// emails easily by importing the generated icon modules.

const svgRelativePath = '../../../../../core/icon/svgs_raw';
const svgSrc = resolve(__dirname, svgRelativePath);
const iconDest = resolve(__dirname, './tmp');

const exportOpts = [
  // For panels
  { name: 'info', input: 'editor/info' },
  { name: 'note', input: 'editor/note' },
  { name: 'tip', input: 'editor/hint' },
  { name: 'success', input: 'editor/success' },
  { name: 'warning', input: 'editor/warning' },
  { name: 'error', input: 'editor/error' },
].map(file => ({
  input: resolve(svgSrc, `${file.input}.svg`),
  name: file.name,
  output: resolve(iconDest, `./${file.name}.png`),
}));

const createIcons = () => {
  render(exportOpts, () => {
    // Creates all the icons in one file
    // fs.writeFileSync(
    //   path.resolve(__dirname, './icons.json'),
    //   JSON.stringify(createBase64Map(), null, 2)
    // )

    createIndividualIconModules();

    // create the index
    writeFileSync(
      resolve(__dirname, `./icons/index.ts`),
      exportOpts.map(icon => `export * from './${icon.name}'`).join('\n'),
    );
  });
};

// const createBase64Map = () => exportOpts.reduce((prev, icon) => {
//   return {
//     [icon.name]: `data:image/png;base64,${readFileSync(icon.output).toString('base64')}`,
//     ...prev
//   }
// }, {})

const createIndividualIconModules = () => {
  exportOpts.map(icon =>
    writeFileSync(
      resolve(__dirname, `./icons/${icon.name}.ts`),
      `export const ${icon.name} = 'data:image/png;base64,${readFileSync(
        icon.output,
      ).toString('base64')}}'`,
    ),
  );
};

createIcons();
