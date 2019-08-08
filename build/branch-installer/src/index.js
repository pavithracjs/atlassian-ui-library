/**
 * This file exists to only expose the node requireable `installFromCommit` function without also
 * exposing `validateOptions` and `_installFromCommit`
 */

const { installFromCommit } = require('./install-from-commit');

module.exports = installFromCommit;
