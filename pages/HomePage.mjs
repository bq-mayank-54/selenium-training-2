import { By, until } from 'selenium-webdriver';

export default class HomePage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get('https://magento.softwaretestingboard.com/');
    // Wait for the page title to contain 'Home Page' (you can increase timeout if needed)
    await this.driver.wait(until.titleContains('Home Page'), 10000);
  }

  async addFirstProductToCart() {
    const productListSelector = By.css('.product-items');
    // Wait for product list to load
    await this.driver.wait(until.elementLocated(productListSelector), 10000);

    // Click the first product link to open product details page
    const firstProductLink = await this.driver.findElement(By.css('.product-item a.product-item-link'));
    await firstProductLink.click();

    // Wait for the swatch options container to appear (Size and Color selectors)
    await this.driver.wait(until.elementLocated(By.css('.swatch-attribute')), 10000);

    // Get all swatch option groups
    const optionGroups = await this.driver.findElements(By.css('.swatch-attribute'));
    if (optionGroups.length < 2) {
      throw new Error('Expected at least two option groups (Size and Color)');
    }

    const sizeGroup = optionGroups[0];
    const colorGroup = optionGroups[1];

    // Find available (non-disabled) size and color options
    const sizeOptions = await sizeGroup.findElements(By.css('.swatch-option:not(.disabled)'));
    const colorOptions = await colorGroup.findElements(By.css('.swatch-option:not(.disabled)'));

    if (sizeOptions.length <= 1) {
      throw new Error('Not enough size options — need at least 2 to select index 1');
    }
    if (colorOptions.length === 0) {
      throw new Error('No available color options to select index 0');
    }

    // Select size option at index 1 and color option at index 0
    await sizeOptions[1].click();
    await this.driver.sleep(500); // Wait a little for UI update

    await colorOptions[0].click();
    await this.driver.sleep(500); // Wait a little for UI update

    // Click the "Add to Cart" button
    const addToCartBtn = await this.driver.findElement(By.css('button#product-addtocart-button'));
    await addToCartBtn.click();

    // Wait for success message after adding product to cart
    await this.driver.wait(
      until.elementLocated(By.css('.message-success.success.message')),
      10000,
      'Success message not found after adding to cart'
    );
  }
}
