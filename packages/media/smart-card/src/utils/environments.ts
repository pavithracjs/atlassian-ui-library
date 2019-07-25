const devBaseUrl = 'https://api-private.dev.atlassian.com';
const stgBaseUrl = 'https://api-private.stg.atlassian.com';
const prodBaseUrl = 'https://api-private.atlassian.com';

export const BaseUrls = {
  dev: devBaseUrl,
  development: devBaseUrl,

  stg: stgBaseUrl,
  staging: stgBaseUrl,

  prd: prodBaseUrl,
  prod: prodBaseUrl,
  production: prodBaseUrl,
};

export const getBaseUrl = (envKey?: keyof typeof BaseUrls) => {
  if (envKey) {
    return envKey in BaseUrls ? BaseUrls[envKey] : prodBaseUrl;
  }

  return prodBaseUrl;
};

export const getResolverUrl = (envKey?: keyof typeof BaseUrls) => {
  // If an environment is provided, then use Stargate directly for requests.
  if (envKey) {
    const baseUrl = getBaseUrl(envKey);
    return `${baseUrl}/object-resolver`;
  } else {
    // Otherwise, we fallback to using the Edge Proxy to access Stargate,
    // which fixes some cookie issues with strict Browser policies.
    return '/gateway/object-resolver';
  }
};

export default BaseUrls;
