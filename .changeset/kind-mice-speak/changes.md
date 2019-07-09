BUILDTOOLS-108 Fail Webdriver & Puppeteer test runs on CI either when tests fail or a snapshot is added

This will prevent people forgetting to add snapshots

This will also no longer fail the build on obsolete snapshots for the Webdriver tests. This was a problem because the Landkid build only runs tests on Chrome and we should allow tests that skip Chrome (eg. a Mac-specific test will only run on Safari)
