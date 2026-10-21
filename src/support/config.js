const config = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  username: process.env.SAUCE_USERNAME || 'standard_user',
  password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  timeout: Number(process.env.WAIT_TIMEOUT || 10000),
};

module.exports = config;
