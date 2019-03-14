//@flow
/* 
WIP This codemod was build during shipit it's changes should be carefully scrutinized before shipping ;)
*/

const themeIndexImports = [
  'themed',
  'withTheme',
  'AtlaskitThemeProvider',
  'getTheme',
  'createTheme',
];

const constants = [
  'gridSize',
  'FLATTENED',
  'CHANNEL',
  'DEFAULT_THEME_MODE',
  'THEME_MODES',
  'borderRadius',
  'gridSize',
  'fontSize',
  'fontSizeSmall',
  'fontFamily',
  'codeFontFamily',
  'focusRing',
  'noFocusRing',
  'layers',
  'assistive',
];

const akTheme = '@atlaskit/theme';

const constantsPredicate = specifier =>
  !specifier ||
  !specifier.imported ||
  constants.indexOf(specifier.imported.name) > -1;

function getConstantsImport(j, path) {
  const constantsSpecifierspath = path.value.specifiers.filter(
    constantsPredicate,
  );

  if (constantsSpecifierspath.length === 0) {
    return;
  }

  return j.importDeclaration(
    constantsSpecifierspath,
    j.literal(`${akTheme}/constants`),
  );
}
const indexPredicate = specifier =>
  !specifier ||
  !specifier.imported ||
  themeIndexImports.indexOf(specifier.imported.name) > -1;

function getIndexImport(j, path) {
  const mainIndexSpecifierspath = path.value.specifiers.filter(indexPredicate);

  if (mainIndexSpecifierspath.length === 0) {
    return;
  }

  return j.importDeclaration(
    mainIndexSpecifierspath,
    j.literal(`${akTheme}/components`),
  );
}

function getOtherImports(j, path) {
  return path.value.specifiers
    .filter(
      specifier => !indexPredicate(specifier) && !constantsPredicate(specifier),
    )
    .map(specifier =>
      j.importDeclaration(
        [j.importNamespaceSpecifier(j.identifier(specifier.imported.name))],
        j.literal(`${akTheme}/${specifier.imported.name}`),
      ),
    );
}

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const akTheme = '@atlaskit/theme';

  return j(file.source)
    .find(j.ImportDeclaration)
    .filter(path => path.node.source.value === akTheme)
    .forEach(path => {
      const [firstImport, ...importsAfter] = [
        getIndexImport(j, path),
        getConstantsImport(j, path),
        ...getOtherImports(j, path),
      ].filter(importStat => importStat);

      if (!firstImport) {
        return;
      }

      firstImport.comments = path.value.comments;

      j(path)
        .replaceWith(firstImport)
        .insertAfter(importsAfter);
    })
    .toSource();
}
