// @flow
// Press ctrl+space for code completion
export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.ImportNamespaceSpecifier)
    .filter(path => {
      return (
        j(file.source)
          .find(j.CallExpression, exp => {
            return (
              exp.callee.type === 'Identifier' &&
              exp.callee.name === path.node.local.name
            );
          })
          .size() > 0 ||
        j(file.source)
          .find(j.NewExpression, exp => {
            return (
              exp.callee.type === 'Identifier' &&
              exp.callee.name === path.node.local.name
            );
          })
          .size() > 0
      );
    })
    .replaceWith(path => {
      return j.importDefaultSpecifier(path.node.local);
    })
    .toSource();
}
