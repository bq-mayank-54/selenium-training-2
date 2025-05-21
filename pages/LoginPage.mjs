import { By, until } from 'selenium-webdriver';

export default class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.url = 'https://magento.softwaretestingboard.com/customer/account/login/';
  }

  async open() {
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(By.id('login-form')), 5000);
  }

  async login(email, password) {
    await this.driver.findElement(By.id('email')).sendKeys(email);
    await this.driver.findElement(By.id('pass')).sendKeys(password);
    await this.driver.findElement(By.id('send2')).click();

    await this.driver.wait(until.urlContains('customer/account'), 10000);
  }
}
