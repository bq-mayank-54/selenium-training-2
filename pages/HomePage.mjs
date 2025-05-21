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

  async addFirstProductToCart(retries = 2) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempt ${attempt}: Adding first product to cart`);
        await this.open(); // Refresh home page each attempt
  
        // Wait for product list and click
        await this.driver.wait(until.elementLocated(By.css('.product-items')), 10000);
        const firstProductLink = await this.driver.findElement(By.css('.product-item a.product-item-link'));
        await firstProductLink.click();
  
        // Wait for swatch options
        await this.driver.wait(until.elementLocated(By.css('.swatch-attribute')), 10000);
        const optionGroups = await this.driver.findElements(By.css('.swatch-attribute'));
  
        if (optionGroups.length < 2) throw new Error('Less than 2 option groups');
  
        const sizeOptions = await optionGroups[0].findElements(By.css('.swatch-option:not(.disabled)'));
        const colorOptions = await optionGroups[1].findElements(By.css('.swatch-option:not(.disabled)'));
  
        if (sizeOptions.length <= 1) throw new Error('Not enough size options');
        if (colorOptions.length === 0) throw new Error('No available color options');
  
        await sizeOptions[1].click();
        await this.driver.sleep(500);
        await colorOptions[0].click();
        await this.driver.sleep(500);
  
        const addToCartBtn = await this.driver.findElement(By.css('button#product-addtocart-button'));
        await addToCartBtn.click();
  
        await this.driver.wait(
          until.elementLocated(By.css('.message-success.success.message')),
          10000
        );
  
        console.log('Product added to cart successfully.');
        return; // SUCCESS EXIT
      } catch (err) {
        console.error(`Attempt ${attempt} failed: ${err.message}`);
        if (attempt === retries) throw err; // Give up after last attempt
      }
    }
  }
    
}
