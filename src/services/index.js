const users = require('./users/users.service.js');
const markets = require('./markets/markets.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(markets);
};
