import { By, until } from 'selenium-webdriver';
import { retry } from '../utils/retry.js';

export default class CartPage {
  constructor(driver) {
    this.driver = driver;
    this.url = 'https://magento.softwaretestingboard.com/checkout/cart/';
  }

  async open() {
    await this.driver.get(this.url);
    await this.driver.wait(until.titleContains('Shopping Cart'), 10000);
  }

  async getCartItemsCount() {
    const rows = await this.driver.findElements(By.css('table.data.table tbody tr'));
    return rows.length;
  }

  async removeAllItems() {
    try {
      await retry(() =>
        this.driver.wait(until.elementLocated(By.css("a.action-delete")), 10000),
        3,
        1000,
        "wait for at least one delete button"
      );
    } catch (err) {
      // No items to delete
      return;
    }

    let deleteButtons = await this.driver.findElements(By.css("a.action-delete"));

    while (deleteButtons.length > 0) {
      const deleteBtn = deleteButtons[0];

      await this.driver.executeScript('arguments[0].scrollIntoView(true);', deleteBtn);
      await this.driver.wait(until.elementIsVisible(deleteBtn), 5000);
      await this.driver.wait(until.elementIsEnabled(deleteBtn), 5000);

      await retry(() => deleteBtn.click(), 3, 500, 'click delete button');

      // Retry waiting for confirmation popup if it exists
      try {
        const confirmBtn = await retry(() =>
          this.driver.findElement(By.css('button.action-primary.action-accept')),
          3,
          500,
          'find confirm button'
        );
        await confirmBtn.click();
      } catch (e) {
        // Sometimes the confirmation modal doesn't show, safely ignore
      }

      // Wait for cart UI update
      await this.driver.sleep(1500);

      deleteButtons = await this.driver.findElements(By.css("a.action-delete"));
    }
  }
}
