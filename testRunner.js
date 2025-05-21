import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

export async function createDriver(headless = false) {
  const options = new chrome.Options();
  if (headless) {
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
  }

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  return driver;
}
