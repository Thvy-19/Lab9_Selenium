const { By, until } = require('selenium-webdriver');
const config = require('../support/config');

class CartPage {
  constructor(driver) {
    this.driver = driver;
    this.cartItems = By.css('[data-test="inventory-item"]');
    this.itemNames = By.css('[data-test="inventory-item-name"]');
    this.checkoutButton = By.id('checkout');
  }

  productCard(productName) {
    return By.xpath(
      `//div[@data-test='inventory-item'][.//div[@data-test='inventory-item-name' and normalize-space()='${productName}']]`,
    );
  }

  async getItemNames() {
    const elements = await this.driver.findElements(this.itemNames);
    return Promise.all(elements.map((element) => element.getText()));
  }

  async removeProduct(productName) {
    const card = await this.driver.findElement(this.productCard(productName));
    await card.findElement(By.css('button[data-test^="remove"]')).click();
    await this.driver.wait(async () => {
      const names = await this.getItemNames();
      return !names.includes(productName);
    }, config.timeout);
  }

  async getItemCount() {
    return (await this.driver.findElements(this.cartItems)).length;
  }

  async checkout() {
    await this.driver.findElement(this.checkoutButton).click();
    await this.driver.wait(
      until.urlContains('/checkout-step-one.html'),
      config.timeout,
    );
  }
}

module.exports = CartPage;
