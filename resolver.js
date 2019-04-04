// @flow
const fs = require('fs');
const path = require('path');
const resolveFrom = require('resolve-from');

/* 
These modules should not have their imports resolved differently 
as their src is in root of the package.
*/
const blockedFromMultiEntryPointsModuleList = [
  'build-utils',
  'polyfills',
  'webdriver-runner',
  'visual-regression',
];

/** This file is used to resolve imports in jest.
 *  This is used to make sure that packages resolve using the same algorithm as our webpack config
 *  (checking for "atlaskit:src", etc) meaning that we dont need the old root index.js hack anymore
 */

// This is the resolver used by webpack, which we configure similarly
// to AK website (see ./website/webpack.config.js - "resolve" field)
const wpResolver = require('enhanced-resolve').ResolverFactory.createResolver({
  fileSystem: fs,
  useSyncFileSystemCalls: true,
  mainFields: ['atlaskit:src', 'browser', 'main'],
  extensions: ['.js', '.ts', '.tsx'],
});

module.exports = function resolver(
  modulePath /*: string */,
  params /*: any */,
) {
  // If resolving relative paths, make sure we use resolveFrom and not resolve
  if (modulePath.startsWith('.') || modulePath.startsWith(path.sep)) {
    try {
      return resolveFrom(params.basedir, modulePath);
    } catch (e) {} // eslint-disable-line
  }

  /*
  The alternative entry files are only created at publish time. So for jest we resolve 
  import { N0 } from '@atlaskit/theme/colors'
  to
  import { N0 } from '@atlaskit/theme/src/colors'
   */
  let alternativeEntryModulePath;
  const paths = modulePath.split('/');
  const [, moduleName, entryPoint] = paths;

  if (
    modulePath.startsWith('@atlaskit/') &&
    paths.length === 3 &&
    typeof entryPoint === 'string' &&
    entryPoint.trim().length > 0
  ) {
    if (blockedFromMultiEntryPointsModuleList.indexOf(moduleName) === -1) {
      alternativeEntryModulePath = `@atlaskit/${moduleName}/src/${entryPoint}`;
    }
  }

  // Otherwise try to resolve to source files of AK packages using webpack resolver
  let result = wpResolver.resolveSync(
    {},
    params.basedir,
    alternativeEntryModulePath || modulePath,
  );

  if (result) {
    // Dereference symlinks to ensure we don't create a separate
    // module instance depending on how it was referenced.
    // @link https://github.com/facebook/jest/pull/4761
    result = fs.realpathSync(result);
  }

  return result;
};
