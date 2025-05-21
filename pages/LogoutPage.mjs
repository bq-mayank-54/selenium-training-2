import { By, until } from 'selenium-webdriver';

export default class LogoutPage {
  constructor(driver) {
    this.driver = driver;
    this.url = 'https://demo.opencart.com/index.php?route=account/logout';
  }

  async open() {
    await this.driver.get(this.url);
    await this.driver.wait(until.urlIs('https://demo.opencart.com/'), 10000);
  }
}
