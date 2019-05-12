const devBaseUrl = 'https://api-private.dev.atlassian.com';
const devEnvironment = {
  baseUrl: devBaseUrl,
  resolverUrl: `${devBaseUrl}/object-resolver`,
};

const stgBaseUrl = 'https://api-private.stg.atlassian.com';
const stagingEnvironment = {
  baseUrl: stgBaseUrl,
  resolverUrl: `${stgBaseUrl}/object-resolver`,
};

const prodBaseUrl = 'https://api-private.atlassian.com';
const prodEnvironment = {
  baseUrl: prodBaseUrl,
  resolverUrl: `${prodBaseUrl}/object-resolver`,
};

export const Environments = {
  dev: devEnvironment,
  development: devEnvironment,

  stg: stagingEnvironment,
  staging: stagingEnvironment,

  prd: prodEnvironment,
  prod: prodEnvironment,
  production: prodEnvironment,
};

export const getEnvironment = (envKey: keyof typeof Environments) =>
  envKey in Environments ? Environments[envKey] : prodEnvironment;

export default Environments;
