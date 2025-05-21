import { createDriver } from '../testRunner.js';
import { expect } from 'chai';

import SignupPage from '../pages/SignupPage.mjs';
import LoginPage from '../pages/LoginPage.mjs';
import HomePage from '../pages/HomePage.mjs';
import CartPage from '../pages/CartPage.mjs';

describe('Magento Demo E2E CRUD Flow', function () {
  this.timeout(120000); // Increase timeout for all tests to 2 mins

  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@mail.com`,
    password: 'Test@12345',
  };

  let driver;
  let signupPage, loginPage, homePage, cartPage;

  // Create and quit a new driver for EACH test (clean fresh session)
  beforeEach(async () => {
    driver = await createDriver(true); // headless mode
    signupPage = new SignupPage(driver);
    loginPage = new LoginPage(driver);
    homePage = new HomePage(driver);
    cartPage = new CartPage(driver);
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('should register a new user', async () => {
    await signupPage.open();
    await signupPage.registerUser(testUser);
    const url = await driver.getCurrentUrl();
    expect(url).to.include('customer/account');
  });

  it('should logout after registration', async () => {
    await driver.get('https://magento.softwaretestingboard.com/customer/account/logout/');
    await driver.sleep(2000);
  });

  it('should login with registered user', async () => {
    await loginPage.open();
    await loginPage.login(testUser.email, testUser.password);
    const url = await driver.getCurrentUrl();
    expect(url).to.include('customer/account');
  });

  // Retry 2 times if flaky
  it('should add an item to cart and validate', async function () {
    this.timeout(90000);
    this.retries(2);

    await homePage.open();
    await homePage.addFirstProductToCart();

    await cartPage.open();
    const count = await cartPage.getCartItemsCount();
    expect(count).to.be.above(0);
  });

  // Retry 2 times for flaky delete as well
  it('should delete all items from cart and validate empty', async function () {
    this.timeout(90000);
    this.retries(2);

    await cartPage.removeAllItems();

    await cartPage.open();
    const countAfterDelete = await cartPage.getCartItemsCount();
    expect(countAfterDelete).to.equal(0);
  });
});
