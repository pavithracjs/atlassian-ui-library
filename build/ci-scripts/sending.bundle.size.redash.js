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
    server: process.env.CI ? 'master' : 'test',
    product: 'atlaskit',
    user: process.env.CI ? '-' : process.env.USER, // On CI we send as an anonymous user
    serverTime: Date.now(),
  };
};

const prepareData = pathToFolder => {
  const files = fs.readdirSync(pathToFolder);
  if (files.length > 0 && files) {
    let properties = [];
    for (file of files) {
      try {
        const content = JSON.parse(
          fs.readFileSync(path.join(pathToFolder, file)),
        );
        properties.push(content);
      } catch (err) {
        console.log(`${err}`);
      }
    }
    return properties;
  }
};

(async () => {
  const bundleSizeData = prepareData(
    path.join(process.cwd(), '.masterBundleSize'),
  );
  return sendToRedash(
    JSON.stringify({
      events: bundleSizeData.map(data =>
        buildEventPayload(
          data.map(obj => {
            return {
              name: obj.packageName,
              version: obj.version,
              size: obj.stats,
            };
          }),
          `atlaskit.bundle.size.${data.id}`,
        ),
      ),
    }),
  ).then(res => {
    console.log(`Sent bundle size data to Redash`);
  });
})();
