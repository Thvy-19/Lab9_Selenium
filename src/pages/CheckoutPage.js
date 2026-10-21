const { By, until } = require('selenium-webdriver');
const config = require('../support/config');

class CheckoutPage {
  constructor(driver) {
    this.driver = driver;
    this.firstNameInput = By.id('first-name');
    this.lastNameInput = By.id('last-name');
    this.postalCodeInput = By.id('postal-code');
    this.continueButton = By.id('continue');
    this.finishButton = By.id('finish');
    this.completeHeader = By.css('[data-test="complete-header"]');
  }

  async enterCustomerInformation(firstName, lastName, postalCode) {
    const firstNameField = await this.driver.wait(
      until.elementLocated(this.firstNameInput),
      config.timeout,
    );
    await this.driver.wait(until.elementIsVisible(firstNameField), config.timeout);

    await firstNameField.sendKeys(firstName);
    await this.driver.findElement(this.lastNameInput).sendKeys(lastName);
    await this.driver.findElement(this.postalCodeInput).sendKeys(postalCode);
    await this.driver.findElement(this.continueButton).click();
    await this.driver.wait(
      until.urlContains('/checkout-step-two.html'),
      config.timeout,
    );
  }

  async finishOrder() {
    const finish = await this.driver.wait(
      until.elementLocated(this.finishButton),
      config.timeout,
    );
    await this.driver.wait(until.elementIsVisible(finish), config.timeout);
    await finish.click();
    await this.driver.wait(
      until.urlContains('/checkout-complete.html'),
      config.timeout,
    );
  }

  async getCompleteMessage() {
    const message = await this.driver.wait(
      until.elementLocated(this.completeHeader),
      config.timeout,
    );
    await this.driver.wait(until.elementIsVisible(message), config.timeout);
    return message.getText();
  }
}

module.exports = CheckoutPage;
