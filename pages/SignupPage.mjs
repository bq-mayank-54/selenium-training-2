import { By, until } from 'selenium-webdriver';

export default class SignupPage {
  constructor(driver) {
    this.driver = driver;
    this.url = 'https://magento.softwaretestingboard.com/customer/account/create/';
  }

  async open() {
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(By.id('form-validate')), 5000);
  }

  async registerUser(user) {
    await this.driver.findElement(By.id('firstname')).sendKeys(user.firstName);
    await this.driver.findElement(By.id('lastname')).sendKeys(user.lastName);
    await this.driver.findElement(By.id('email_address')).sendKeys(user.email);
    await this.driver.findElement(By.id('password')).sendKeys(user.password);
    await this.driver.findElement(By.id('password-confirmation')).sendKeys(user.password);

    await this.driver.findElement(By.css('button[title="Create an Account"]')).click();

    // Wait for account page or welcome message
    await this.driver.wait(until.urlContains('customer/account'), 10000);
  }
}
