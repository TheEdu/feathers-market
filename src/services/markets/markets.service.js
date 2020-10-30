// Initializes the `markets` service on path `/markets`
const { Markets } = require('./markets.class');
const createModel = require('../../models/markets.model');
const hooks = require('./markets.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/markets', new Markets(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('markets');

  service.hooks(hooks);
};
