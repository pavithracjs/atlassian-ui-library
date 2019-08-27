const fetch = require('node-fetch');

async function retryFetch(url, options) {
  let retry = options.retry || 3;
  try {
    return await fetch(url, options);
  } catch (e) {
    if (options.cb) {
      options.cb(e, retry);
    }
    retry--;
    if (retry === 0) {
      throw e;
    }
  }
}

module.exports = {
  retryFetch,
};
