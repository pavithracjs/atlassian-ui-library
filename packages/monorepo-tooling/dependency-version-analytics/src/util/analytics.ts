import fetch from 'node-fetch';

class AnalyticsClient {
  static request(options) {
    return new AnalyticsClient(options);
  }

  constructor(options) {
    this.package = options.package;
    this.version = options.version;
    this.payload = [];
  }

  add(eventName, properties = {}) {
    if (
      Object.values(properties).some(key => typeof properties[key] === 'object')
    ) {
      console.warn('Analytic properties are expected to be a flat JSON object');
    }
    this.payload.push({ name: eventName, properties });
    return this;
  }

  send() {
    return fetch('https://analytics.atlassian.com/analytics/events', {
      method: 'POST',
      headers: {
        Accept: 'application/json, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events: this.payload.map(event => ({
          name: event.name,
          properties: event.properties,
          server: 'dev', // Make this prod for master branch builds
          product: 'atlaskit',
          subproduct: this.package,
          version: this.version,
          user: '-',
          serverTime: Date.now(),
        })),
      }),
    });
  }

  dry() {
    const rows = [];
    this.payload.forEach(event => {
      const properties = Object.keys(event.properties)
        .map(key => `${key}: ${event.properties[key]}`)
        .join(', ');
      rows.push([this.package, this.version, event.name, properties]);
    });
    const eventTable = new Table(
      [
        { value: 'Package' },
        { value: 'Version' },
        { value: 'Name' },
        { value: 'Properties', width: 100 },
      ],
      rows,
    );
    console.log(eventTable.render());
  }
}

module.exports = AnalyticsClient;
