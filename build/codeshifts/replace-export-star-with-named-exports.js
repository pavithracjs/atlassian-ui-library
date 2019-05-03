/**
 * Run from root directory of jira-frontend:
 * NODE_PATH=$NODE_PATH:$PWD/src jscodeshift -t scripts/codemods/replace-export-star-with-named-exports.js src
 *
 * Apply lint fixes:
 * git status | egrep -o "(src.*)" | xargs yarn eslint --fix
 *
 * @author Jeremy Fu
 */

const appRoot = require('app-root-path');
const fs = require('fs');
const path = require('path');
const resolveFrom = require('resolve-from');

const EXPORT_KIND_VALUE = 'value';
const EXPORT_KIND_TYPE = 'type';

const getNamedExports = (j, src, exportKind) =>
  src
    .find(j.ExportNamedDeclaration)
    .filter(({ node }) => node.exportKind === exportKind);

const getMultipleNamedExports = namedExports => {
  const exportNames = [];

  const multipleNamedExports = namedExports.filter(
    ({ node }) => node.specifiers.length,
  );
  multipleNamedExports.forEach(({ node }) => {
    node.specifiers
      // export * does not export default exports so ignore them
      .filter(specifier => specifier.exported.name !== 'default')
      .forEach(specifier => exportNames.push(specifier.exported.name));
  });

  return exportNames;
};

const getSingleNamedExports = namedExports => {
  const exportNames = [];

  const singleNamedExports = namedExports.filter(
    ({ node }) => node.declaration,
  );
  singleNamedExports.forEach(({ node }) => {
    const { declaration } = node;
    const { type } = declaration;

    if (type === 'VariableDeclaration') {
      const variableDeclarator = declaration.declarations.pop();
      exportNames.push(variableDeclarator.id.name);
    } else if (
      type === 'TypeAlias' ||
      type === 'OpaqueType' ||
      type === 'FunctionDeclaration' ||
      type === 'ClassDeclaration'
    ) {
      exportNames.push(declaration.id.name);
    }
  });

  return exportNames;
};

const getExportNames = (j, basePath, importPath, exportKind) => {
  const filePath = resolveFrom(path.dirname(basePath), importPath);

  if (filePath.includes('node_modules')) {
    console.log(`Bailed when detected re-export of ${filePath}`);
    return [];
  }

  const src = j(fs.readFileSync(filePath, { encoding: 'utf8' }));

  const exportNames = [];
  // This is actually a custom jscodeshift collection and not a regular array
  const namedExports = getNamedExports(j, src, exportKind);

  // map is a function defined by the jscodeshift collection to return a NodeInfo collection and hence is not suited to returning a string name. This is why forEach has been used
  getMultipleNamedExports(namedExports).forEach(exportName =>
    exportNames.push(exportName),
  );
  getSingleNamedExports(namedExports).forEach(exportName =>
    exportNames.push(exportName),
  );

  src
    .find(j.ExportAllDeclaration)
    .forEach(({ node }) =>
      getExportNames(j, filePath, node.source.value, exportKind).forEach(
        exportName => exportNames.push(exportName),
      ),
    );

  return exportNames;
};

const buildExportNode = (j, exportNames, filePath, exportKind) => {
  const exportNamedDeclaration = j.exportNamedDeclaration(
    null,
    exportNames.map(exportName =>
      j.exportSpecifier(j.identifier(exportName), j.identifier(exportName)),
    ),
    j.literal(filePath),
  );
  exportNamedDeclaration.exportKind = exportKind;

  return exportNamedDeclaration;
};

// eslint-disable-next-line no-unused-vars
module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const src = j(file.source);
  const filePath = path.resolve(appRoot.path, file.path);

  // retain first line comment - https://github.com/facebook/jscodeshift/blob/master/recipes/retain-first-comment.md
  const getFirstNode = () => src.find(j.Program).get('body', 0).node;

  // Save the comments attached to the first node
  const firstNode = getFirstNode();
  const { comments } = firstNode;

  // TODO: could improve performance by returning an object containing both value exports and type exports instead of parsing imported files twice
  // Did not do this at first because did not realise export * also exports types.

  src
    .find(j.ExportAllDeclaration)
    .insertBefore(({ node }) => {
      const importPath = node.source.value;

      const exportNames = getExportNames(
        j,
        filePath,
        importPath,
        EXPORT_KIND_VALUE,
      );
      if (exportNames.length === 0) return null;

      return buildExportNode(j, exportNames, importPath, EXPORT_KIND_VALUE);
    })
    .insertBefore(({ node }) => {
      const importPath = node.source.value;

      const exportNames = getExportNames(
        j,
        filePath,
        importPath,
        EXPORT_KIND_TYPE,
      );
      if (exportNames.length === 0) return null;

      return buildExportNode(j, exportNames, importPath, EXPORT_KIND_TYPE);
    })
    .remove();

  // If the first node has been modified or deleted, reattach the comments
  const curFirstNode = getFirstNode();
  if (curFirstNode !== firstNode) {
    curFirstNode.comments = comments;
  }

  return src.toSource({
    quote: 'single',
  });
};
