# Dist checker

Validates built package dists against versions installed from npm to prevent build tool refactoring to break what we ship.

# Usage

1. Run `bolt` to ensure you have the latest deps installed
2. Build your package
3. Run `yarn validate-packages <packageName>` to validate the package against npm
