// @flow
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
    return properties;
  } catch (err) {
    console.log(`${err}`);
  }
};

(async () => {
  const bundleSizeData =
    prepareData(path.join(process.cwd(), '.masterBundleSize')) || []; // By default, it will be an empty array to avoid Flow issues.
  const bundleSizeDataEvents = JSON.stringify({
    events: bundleSizeData.map(data =>
      buildEventPayload(
        data.map(obj => {
          return {
            id: obj.id,
            package: obj.package,
            version: obj.version,
            size: obj.stats,
          };
        }),
        'atlaskit.computed.bundle.size.per.package',
      ),
    ),
  });
  return sendToRedash(bundleSizeDataEvents).then(res => {
    console.log(`Sent bundle size data to Redash`);
  });
})();
