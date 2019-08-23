Fix non-critical exception when updating media nodes

`contextIdentifierProvider` is an optional provider for consumers of the Editor. Some code assumed that this was always provided. Some tests, for example, did not pass this, so they would blow up.