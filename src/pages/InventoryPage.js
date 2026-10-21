const { By, until } = require('selenium-webdriver');
const { Select } = require('selenium-webdriver/lib/select');
const config = require('../support/config');

class InventoryPage {
  constructor(driver) {
    this.driver = driver;
    this.pageTitle = By.css('[data-test="title"]');
    this.productPrices = By.css('[data-test="inventory-item-price"]');
    this.sortSelect = By.css('[data-test="product-sort-container"]');
    this.cartLink = By.css('[data-test="shopping-cart-link"]');
    this.cartBadge = By.css('[data-test="shopping-cart-badge"]');
    this.menuButton = By.id('react-burger-menu-btn');
    this.logoutLink = By.id('logout_sidebar_link');
  }

  productCard(productName) {
    return By.xpath(
      `//div[@data-test='inventory-item'][.//div[@data-test='inventory-item-name' and normalize-space()=${this.xpathLiteral(productName)}]]`,
    );
  }

  xpathLiteral(value) {
    if (!value.includes("'")) return `'${value}'`;
    if (!value.includes('"')) return `"${value}"`;
    return `concat('${value.replaceAll("'", "',\"'\",'")}')`;
  }

  async waitUntilLoaded() {
    await this.driver.wait(until.urlContains('/inventory.html'), config.timeout);
    const title = await this.driver.wait(
      until.elementLocated(this.pageTitle),
      config.timeout,
    );
    await this.driver.wait(until.elementTextIs(title, 'Products'), config.timeout);
  }

  async getTitle() {
    return this.driver.findElement(this.pageTitle).getText();
  }

  async sortByVisibleText(label) {
    const selectElement = await this.driver.findElement(this.sortSelect);
    const select = new Select(selectElement);
    await select.selectByVisibleText(label);
  }

  async getPrices() {
    const elements = await this.driver.findElements(this.productPrices);
    const labels = await Promise.all(elements.map((element) => element.getText()));
    return labels.map((label) => Number(label.replace('$', '')));
  }

  async waitForPrices(expectedPrices) {
    await this.driver.wait(async () => {
      const currentPrices = await this.getPrices();
      return JSON.stringify(currentPrices) === JSON.stringify(expectedPrices);
    }, config.timeout);
  }

  async addProduct(productName) {
    const card = await this.driver.findElement(this.productCard(productName));
    await card.findElement(By.css('button[data-test^="add-to-cart"]')).click();
  }

  async getCartCount() {
    const badges = await this.driver.findElements(this.cartBadge);
    return badges.length === 0 ? 0 : Number(await badges[0].getText());
  }

  async openCart() {
    await this.driver.findElement(this.cartLink).click();
    await this.driver.wait(until.urlContains('/cart.html'), config.timeout);
  }

  async logout() {
    await this.driver.findElement(this.menuButton).click();
    const logout = await this.driver.wait(
      until.elementLocated(this.logoutLink),
      config.timeout,
    );
    await this.driver.wait(until.elementIsVisible(logout), config.timeout);
    await logout.click();
  }
}

module.exports = InventoryPage;
