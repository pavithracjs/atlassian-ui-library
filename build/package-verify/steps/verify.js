//@flow
/*::
import type { VerifyConfig, PackageConfig, Fields } from '../index';
*/
const path = require('path');
const ora = require('ora');
const { pathsExist } = require('../utils');

module.exports = async function verify(
  verifyConfig /*: VerifyConfig */,
  tmpdir /*: string */,
  pkgConfig /*: PackageConfig */,
) {
  const verifier = ora(`${pkgConfig.name} verifying`).start();
  const pkgPath = path.join(tmpdir, 'node_modules', pkgConfig.name);
  let fieldEntries = [];
  let customPaths = [];
  let fieldMatches = [];
  let fieldMatchStatus = {};

  if (verifyConfig && verifyConfig.fields) {
    fieldEntries = await getFieldValuesfromPkgJson(
      pkgConfig,
      verifyConfig.fields,
    );
  }

  if (verifyConfig && verifyConfig.customPaths) {
    customPaths = verifyConfig.customPaths.map(path => ({
      key: 'customPath',
      value: path,
    }));
  }

  if (verifyConfig && verifyConfig.customPaths) {
    fieldMatches = Object.keys(verifyConfig.fieldMatch || {}).map(field => ({
      type: 'fieldMatch',
      value: field,
      key: verifyConfig.fieldMatch && verifyConfig.fieldMatch[field],
    }));
    fieldMatchStatus = await validateFieldMatch(
      pkgConfig,
      verifyConfig.fieldMatch || {},
    );
  }

  const validatePath = await pathsExist(pkgPath, [
    'package.json',
    ...fieldEntries.map(f => f.value),
    ...customPaths.map(f => f.value),
  ]);

  verifier.succeed(`${pkgConfig.name} verification complete`);
  return {
    tmpdir,
    paths: [
      ...mapReturnFields(
        [{ key: 'default', value: 'package.json' }],
        validatePath,
      ),
      ...mapReturnFields(fieldEntries, validatePath),
      ...mapReturnFields(customPaths, validatePath),
    ],
    fieldMatches: mapReturnFields(fieldMatches, fieldMatchStatus),
  };
};

function mapReturnFields(collection, validatedCollection /*: any */) {
  return (collection || []).reduce((acc, current) => {
    acc.push({
      ...current,
      found: validatedCollection[current.value] || false,
    });
    return acc;
  }, []);
}

async function getFieldValuesfromPkgJson(
  pkgConfig,
  fields /*: Array<Fields> */,
) {
  return fields.reduce((acc, key) => {
    if (pkgConfig[key]) {
      acc.push({
        key,
        value: pkgConfig[key],
      });
    }
    return acc;
  }, []);
}

async function validateFieldMatch(pkgConfig, fieldMatch) {
  return Object.keys(fieldMatch).reduce((acc, key /*: string | Fields */) => {
    return {
      ...acc,
      [key]: pkgConfig[key] === fieldMatch[key],
    };
  }, {});
}
