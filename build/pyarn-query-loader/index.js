// @flow

const loaderUtils = require('loader-utils');
const pyarnQuery = require('pyarn-query');

module.exports = async function extractReactTypesLoader() {
  const opts = loaderUtils.getOptions(this);
  const data = await pyarnQuery(opts);
  const load = [];
  data.workspaces.forEach(({ files }) => {
    Object.keys(files).forEach(key => {
      files[key].forEach(({ filePath }) => {
        load.push(`'${filePath}': function () { return import('${filePath}'); }`);
      });
    });
  });
  return `export default {
    data: ${JSON.stringify(data)},
    load: {${load.join(',')}}
  };`;
};
