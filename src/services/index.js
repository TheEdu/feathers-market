const users = require('./users/users.service.js');
const markets = require('./markets/markets.service.js');
const products = require('./products/products.service.js');
const prices = require('./prices/prices.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(markets);
  app.configure(products);
  app.configure(prices);
};
