const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function createDriver() {
  const options = new chrome.Options();

  if (process.env.HEADLESS !== 'false') {
    options.addArguments('--headless=new');
  }

  options.addArguments(
    '--window-size=1440,1000',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-search-engine-choice-screen',
  );

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: 0,
    pageLoad: 30000,
    script: 30000,
  });

  return driver;
}

module.exports = createDriver;
