// @flow
const colors = require('colors');

/*::
type FieldResult = { key: string, value: string, found: boolean, type?: 'fieldMatch' }

type Result = {
  paths: Array<FieldResult>,
  fieldMatches: Array<FieldResult>
}

type CompiledAssets = {
  entryPoints: Array<'main' | 'module'>,
  stats: {
    [name: string]: string
  }
}
*/

function printResult(
  packageName /*: string */,
  result /*: Result */,
  compiledAssets /*: CompiledAssets */,
) {
  const pathsFound = filter(result.paths, true);
  const pathsNotFound = filter(result.paths, false);

  const fieldMatches = filter(result.fieldMatches, true);
  const fieldNonMatches = filter(result.fieldMatches, false);

  console.log(`
${colors.bold(packageName)}

${printCompileResults('Compiled entry points:', compiledAssets)}
${printItems('Found:', pathsFound, '✔')}
${printItems('Matched fields:', fieldMatches, '✔')}
${printItems('Not found:', pathsNotFound, '😩 ', 'red')}
${printItems(`Fields that didn't match:`, fieldNonMatches, '😩 ', 'red')}
`);
}

function printItems(label, items, prefix, color = 'green') {
  if (items.length === 0) {
    return '';
  }

  return `    ${colors.bold(label)}
${items
    .map(match => {
      if (match.type === 'fieldMatch') {
        return colors[color](
          `    ${prefix} ${match.value} ${
            match.found ? 'matched' : 'did not match'
          } ${match.key}`,
        );
      }
      return colors[color](`    ${prefix}  ${match.value} (${match.key})`);
    })
    .join('\n')}
  `;
}

function printCompileResults(label, result /*: CompiledAssets */) {
  return `    ${colors.bold(label)}
${result.entryPoints
    .map(entry => {
      const prefix = result.stats[entry] ? '✔' : '😩 ';
      const color = result.stats[entry] ? 'green' : 'red';
      return colors[color](`    ${prefix}  ${entry}`);
    })
    .join('\n')}
  `;
}

function filter(result /*: Array<FieldResult> */, found /*: boolean */) {
  return result.filter(r => r.found === found);
}

module.exports = printResult;
