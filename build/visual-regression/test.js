const puppeteer = require('puppeteer');

puppeteer.launch().then(async browser => {
  // Create a new tab
  const page = await browser.newPage();

  // Connect to Chrome DevTools
  const client = await page.target().createCDPSession();

  // Set throttling property
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: (200 * 1024) / 8,
    uploadThroughput: (200 * 1024) / 8,
    latency: 20,
  });

  // Navigate and take a screenshot
  await page.goto('https://google.com');
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
});
