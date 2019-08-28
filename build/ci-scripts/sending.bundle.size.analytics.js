// @flow
/* Script to send bundle size data to Redash through Analytics pipeline. */
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

function sendToRedash(body) {
  return fetch('https://analytics.atlassian.com/analytics/events', {
    method: 'POST',
    headers: {
      Accept: 'application/json, */*',
      'Content-Type': 'application/json',
    },
    body,
  });
}

const buildEventPayload = (properties, eventName) => {
  return {
    name: eventName,
    properties,
    server: 'master',
    product: 'atlaskit',
    user: '-', // we send as an anonymous user.
    serverTime: Date.now(),
  };
};

const prepareData = pathToFolder => {
  if (!pathToFolder || pathToFolder === '') {
    return;
  }
  try {
    const files = fs.readdirSync(pathToFolder);
    if (files.length === 0 || !files) {
      return;
    }
    let properties = [];
    for (const file of files) {
      try {
        const content = JSON.parse(
          // $FlowFixMe - issue between buffer and string.
          fs.readFileSync(path.join(pathToFolder, file)),
        );
        properties.push(content);
      } catch (err) {
        console.log(`${err}`);
      }
    }
    // We flatten the data to one dimension array of bundle size object data per package.
    // See measure tool for the output or the bundle size doc on the website:
    // https://atlaskit.atlassian.com/docs/guides/bundle-size#what-is-the-most-important-information-in-a-bundle-size-measurement.
    return properties.reduce((acc, val) => acc.concat(val), []);
  } catch (err) {
    console.log(`${err}`);
  }
};

(async () => {
  const bundleSizeData =
    prepareData(path.join(process.cwd(), '.masterBundleSize')) || []; // By default, it will be an empty array to avoid Flow issues.
  const bundleSizeDataEvents = JSON.stringify({
    events: bundleSizeData.map(pkgData =>
      buildEventPayload(pkgData, 'atlaskit.computed.bundle.size.per.package'),
    ),
  });
  sendToRedash(bundleSizeDataEvents)
    .then(res => {
      console.log(`Sent bundle size data to Redash`);
    })
    .catch(err => {
      console.log(`Something went wrong while sending data: ${err}`);
      // Doing so, we don't fail the script in pipelines if an error occurs.
      process.exit(0);
    });
})();
