# Dist checker

Validates built package dists against versions installed from npm to prevent build tool refactoring to break what we ship.

# Usage

1. Run `yarn update-deps` to update the `optionalDependencies` field in `package.json` to reflect the latest versions of packages in the repo.
2. Run `bolt` to install latest versions of all external dependencies and validate that `yarn update-deps` worked correctly
3. Run `yarn fetch-npm-deps` or `yarn fetch-npm-deps --force` to fetch the latest package bundles from the npm registry
4. Run `yarn validate-packages <packageName>` to validate a single package
