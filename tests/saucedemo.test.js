const { afterEach, beforeEach, describe, it } = require('node:test');
const assert = require('node:assert/strict');

const createDriver = require('../src/support/driver');
const config = require('../src/support/config');
const LoginPage = require('../src/pages/LoginPage');
const InventoryPage = require('../src/pages/InventoryPage');
const CartPage = require('../src/pages/CartPage');
const CheckoutPage = require('../src/pages/CheckoutPage');

const BACKPACK = 'Sauce Labs Backpack';

describe('SauceDemo - Selenium end-to-end tests', { concurrency: 1 }, () => {
  let driver;
  let loginPage;
  let inventoryPage;
  let cartPage;
  let checkoutPage;

  beforeEach(async () => {
    driver = await createDriver();
    loginPage = new LoginPage(driver);
    inventoryPage = new InventoryPage(driver);
    cartPage = new CartPage(driver);
    checkoutPage = new CheckoutPage(driver);
    await loginPage.open();
  });

  afterEach(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('TC01 - Đăng nhập thành công bằng tài khoản hợp lệ', async () => {
    await loginPage.login();
    await inventoryPage.waitUntilLoaded();

    assert.equal(await inventoryPage.getTitle(), 'Products');
    assert.match(await driver.getCurrentUrl(), /\/inventory\.html$/);
  });

  it('TC02 - Hiển thị lỗi khi đăng nhập bằng mật khẩu không hợp lệ', async () => {
    await loginPage.login(config.username, 'wrong_password');

    assert.equal(
      await loginPage.getErrorMessage(),
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  it('TC03 - Sắp xếp sản phẩm theo giá từ thấp đến cao', async () => {
    await loginPage.login();
    await inventoryPage.waitUntilLoaded();
    await inventoryPage.sortByVisibleText('Price (low to high)');

    const currentPrices = await inventoryPage.getPrices();
    const sortedPrices = [...currentPrices].sort((a, b) => a - b);
    await inventoryPage.waitForPrices(sortedPrices);

    assert.deepEqual(await inventoryPage.getPrices(), sortedPrices);
  });

  it('TC04 - Thêm một sản phẩm vào giỏ hàng', async () => {
    await loginPage.login();
    await inventoryPage.waitUntilLoaded();
    await inventoryPage.addProduct(BACKPACK);

    assert.equal(await inventoryPage.getCartCount(), 1);
    await inventoryPage.openCart();
    assert.deepEqual(await cartPage.getItemNames(), [BACKPACK]);
  });

  it('TC05 - Xóa sản phẩm khỏi giỏ hàng', async () => {
    await loginPage.login();
    await inventoryPage.waitUntilLoaded();
    await inventoryPage.addProduct(BACKPACK);
    await inventoryPage.openCart();
    await cartPage.removeProduct(BACKPACK);

    assert.equal(await cartPage.getItemCount(), 0);
  });

  it('TC06 - Hoàn tất quy trình thanh toán', async () => {
    await loginPage.login();
    await inventoryPage.waitUntilLoaded();
    await inventoryPage.addProduct(BACKPACK);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.enterCustomerInformation('Nguyen', 'Van An', '700000');
    await checkoutPage.finishOrder();

    assert.equal(await checkoutPage.getCompleteMessage(), 'Thank you for your order!');
  });

  it('TC07 - Đăng xuất khỏi hệ thống', async () => {
    await loginPage.login();
    await inventoryPage.waitUntilLoaded();
    await inventoryPage.logout();
    await loginPage.waitUntilLoaded();

    assert.equal(await driver.getCurrentUrl(), `${config.baseUrl}/`);
  });
});
