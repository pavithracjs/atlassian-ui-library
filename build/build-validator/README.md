# Dist checker

Validates built package dists against versions installed from npm to prevent build tool refactoring to break what we ship.

## Should this live outside workspaces?

Yes, we want to download atlaskit packages from npm as part of the checking process rather than use the linked versions.
