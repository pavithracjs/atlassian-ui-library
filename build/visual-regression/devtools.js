//@flow
'use strict';

const devices = require('puppeteer/DeviceDescriptors');

/*
 * Puppeteer dev tools: test helper utils
 */

// Connect to Chrome Dev Tools
async function getDevToolsClient(page /*:any*/) {
  return await page.target().createCDPSession();
}

/**
 * Throttle Network Connection Speed (Emulated)
 *
 * https://chromedevtools.github.io/devtools-protocol/tot/Network/#method-emulateNetworkConditions
 *
 * @param {*} client Dev tools client
 * @param {*} preset Preset to use instead of default values (e.g. NETWORK_PRESETS)
 * @param {number} downloadKbps Maximal aggregated download throughput (bytes/sec). -1 disables download throttling.
 * @param {number} uploadKbps Maximal aggregated upload throughput (bytes/sec). -1 disables upload throttling.
 * @param {number} latencyMs Minimum latency from request sent to response headers received (ms).
 * @param {boolean} offline True to emulate internet disconnection.
 */
async function setNetworkConnection(
  client /*:any*/,
  preset /*:any*/,
  downloadKbps /*:number*/ = 200,
  uploadKbps /*:number*/ = 200,
  latencyMs /*:number*/ = 60,
  offline /*:boolean*/ = false,
) {
  // Init spoofed connection
  await client.send('Network.enable');
  await client.send(
    'Network.emulateNetworkConditions',
    preset || {
      // Whether network connectivity is offline
      offline: offline,
      // Download speed in bytes per second
      downloadThroughput: (downloadKbps * 1024) / 8,
      // Upload speed in bytes per second
      uploadThroughput: (uploadKbps * 1024) / 8,
      // Simulated latency in milliseconds
      latency: latencyMs,
    },
  );
  return client;
}

const NETWORK_PRESETS = {
  Regular3G: {
    offline: false,
    downloadThroughput: (750 * 1024) / 8,
    uploadThroughput: (250 * 1024) / 8,
    latency: 100,
  },
  Good3G: {
    offline: false,
    downloadThroughput: (1.5 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 40,
  },
  Regular4G: {
    offline: false,
    downloadThroughput: (4 * 1024 * 1024) / 8,
    uploadThroughput: (3 * 1024 * 1024) / 8,
    latency: 20,
  },
  DSL: {
    offline: false,
    downloadThroughput: (2 * 1024 * 1024) / 8,
    uploadThroughput: (1 * 1024 * 1024) / 8,
    latency: 5,
  },
};

/**
 * Throttle CPU Processing Speed (Emulated)
 *
 * https://chromedevtools.github.io/devtools-protocol/tot/Emulation/#method-setCPUThrottlingRate
 *
 * @param {*} client Chrome Dev Tools client
 * @param {number} rate Throttling rate as a slowdown factor (1 is no throttle, 2 is 2x slowdown, etc).
 */
async function throttleCpuProcessing(client /*:any*/, rate /*:number*/ = 4) {
  await client.send('Emulation.setCPUThrottlingRate', { rate });
}

async function disableBrowserCaching(page /*:any*/) {
  await page.setCacheEnabled(false);
}

async function clearBrowserCache(client /*:any*/) {
  await client.send('Network.clearBrowserCache');
}

/**
 * Emulate Device
 *
 * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageemulateoptions
 *
 * It's recommended to emulate the device prior to loading the page.
 *
 * ```
 * await emulateDevice(page, 'iPad landscape');
 * await page.goto(url);
 * ```
 *
 * You can see the list of device names at:
 * https://github.com/GoogleChrome/puppeteer/blob/master/lib/DeviceDescriptors.js
 *
 *
 * @param {*} page Page reference
 * @param {string} Device name (e.g. 'iPhoneX', 'Pixel 2' etc)
 */
async function emulateDevice(page /*:any*/, device /*:string*/) {
  const deviceDescriptor = devices[device];
  await page.emulate(deviceDescriptor);
}

module.exports = {
  getDevToolsClient,
  NETWORK_PRESETS,
  setNetworkConnection,
  throttleCpuProcessing,
  disableBrowserCaching,
  clearBrowserCache,
  emulateDevice,
};
