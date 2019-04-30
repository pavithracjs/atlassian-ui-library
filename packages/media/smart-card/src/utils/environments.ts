const devBaseUrl = 'https://api-private.dev.atlassian.com';
const stgBaseUrl = 'https://api-private.stg.atlassian.com';
const prodBaseUrl = 'https://api-private.atlassian.com';

export default {
  dev: {
    baseUrl: devBaseUrl,
    resolverUrl: `${devBaseUrl}/object-resolver`,
  },
  staging: {
    baseUrl: stgBaseUrl,
    resolverUrl: `${stgBaseUrl}/object-resolver`,
  },
  prod: {
    baseUrl: prodBaseUrl,
    resolverUrl: `${prodBaseUrl}/object-resolver`,
  },
};
