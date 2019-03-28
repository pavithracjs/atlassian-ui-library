// @flow

/*
This codemod was used to enabled "esModuleInterop" in the AK repo
It rewrites namespace imports (`import * as debounce`) that are actually default imports,
to a default import. So

import * as debounce from 'debounce';
debounce();

becomes:

import debounce from 'debounce';
debounce();

*/

export default function transformer(file: any, api: any) {
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
