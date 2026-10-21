const { By, until } = require('selenium-webdriver');
const config = require('../support/config');

class LoginPage {
  constructor(driver) {
    this.driver = driver;
    this.usernameInput = By.id('user-name');
    this.passwordInput = By.id('password');
    this.loginButton = By.id('login-button');
    this.errorMessage = By.css('[data-test="error"]');
  }

  async open() {
    await this.driver.get(config.baseUrl);
    await this.driver.wait(until.elementLocated(this.loginButton), config.timeout);
  }

  async login(username = config.username, password = config.password) {
    const usernameField = await this.driver.findElement(this.usernameInput);
    const passwordField = await this.driver.findElement(this.passwordInput);

    await usernameField.clear();
    await usernameField.sendKeys(username);
    await passwordField.clear();
    await passwordField.sendKeys(password);
    await this.driver.findElement(this.loginButton).click();
  }

  async waitUntilLoaded() {
    const button = await this.driver.wait(
      until.elementLocated(this.loginButton),
      config.timeout,
    );
    await this.driver.wait(until.elementIsVisible(button), config.timeout);
  }

  async getErrorMessage() {
    const message = await this.driver.wait(
      until.elementLocated(this.errorMessage),
      config.timeout,
    );
    await this.driver.wait(until.elementIsVisible(message), config.timeout);
    return message.getText();
  }
}

module.exports = LoginPage;
