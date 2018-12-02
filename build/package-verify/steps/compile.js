//@flow
/*::
import type { PackageConfig } from '../index';
*/
const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');

module.exports = async function buildPackage(
  name /*: string */,
  tmpdir /*: string */,
) {
  const pkgPath = path.join(tmpdir, 'node_modules', name);
  const pkgConfig /*: PackageConfig */ = fs.readJSONSync(
    path.join(pkgPath, 'package.json'),
  );
  const fields /*: Array<string> */ = ['main', 'module'];
  const entryPoints /*: Array<string> */ = fields.filter(
    field => pkgConfig[field],
  );

  return new Promise(resolve => {
    webpack(
      {
        mode: 'production',
        context: tmpdir,
        entry: entryPoints.reduce((acc, entryPoint) => {
          acc[entryPoint] = path.join(pkgPath, pkgConfig[entryPoint] || '');
          return acc;
        }, {}),
        output: {
          filename: '[name].bundle.js',
        },
      },
      (err, webpackStats) => {
        resolve({ webpackStats, entryPoints });
      },
    );
  });
};
